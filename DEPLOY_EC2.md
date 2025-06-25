
# Deploy Frontend + Backend na AWS EC2 (Amazon Linux)

## Pré-requisitos
- Instância EC2 Amazon Linux 2023 criada
- Security Group configurado (portas 22, 80, 443, 8000)
- Par de chaves SSH (.pem)
- Domínio configurado (opcional)

## 1. Conexão e Configuração Inicial

```bash
# Conectar via SSH
ssh -i sua-chave.pem ec2-user@seu-ip-publico

# Atualizar sistema
sudo dnf update -y

# Instalar dependências básicas
sudo dnf install -y git curl wget
```

## 2. Instalar Node.js (para Frontend)

```bash
# Instalar Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install -y nodejs

# Verificar instalação
node --version
npm --version
```

## 3. Instalar Python (para Backend)

```bash
# Python já vem instalado no Amazon Linux, mas instalar pip
sudo dnf install -y python3-pip python3-devel

# Instalar poetry (opcional, para gerenciar dependências)
curl -sSL https://install.python-poetry.org | python3 -

# Ou usar pip diretamente
python3 -m pip install --upgrade pip
```

## 4. Instalar e Configurar MySQL

```bash
# Instalar MySQL
sudo dnf install -y mariadb105-server mariadb105

# Iniciar e habilitar MySQL
sudo systemctl start mariadb
sudo systemctl enable mariadb

# Configurar MySQL
sudo mysql_secure_installation

# Conectar ao MySQL e criar banco
sudo mysql -u root -p

# No MySQL:
CREATE DATABASE sic_dashboard;
CREATE USER 'sic_user'@'localhost' IDENTIFIED BY 'senha_forte_aqui';
GRANT ALL PRIVILEGES ON sic_dashboard.* TO 'sic_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 5. Instalar Nginx

```bash
# Instalar Nginx
sudo dnf install -y nginx

# Iniciar e habilitar Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verificar status
sudo systemctl status nginx
```

## 6. Deploy do Backend (FastAPI)

```bash
# Criar diretório para aplicação
sudo mkdir -p /var/www/sic-backend
sudo chown ec2-user:ec2-user /var/www/sic-backend

# Clonar repositório (ou fazer upload dos arquivos)
cd /var/www/sic-backend
git clone seu-repositorio.git .
# OU fazer upload via scp:
# scp -i sua-chave.pem -r ./backend/* ec2-user@seu-ip:/var/www/sic-backend/

# Instalar dependências Python
pip3 install -r requirements.txt

# Criar arquivo .env
cp .env.example .env
nano .env

# Configure no .env:
# DATABASE_URL=mysql+pymysql://sic_user:senha_forte_aqui@localhost:3306/sic_dashboard
# SECRET_KEY=sua_chave_secreta_super_forte_aqui
# ALGORITHM=HS256
# ACCESS_TOKEN_EXPIRE_MINUTES=30

# Criar usuário admin
python3 create_admin.py

# Testar backend
python3 main.py
# Ctrl+C para parar
```

## 7. Configurar Gunicorn para Backend

```bash
# Instalar gunicorn
pip3 install gunicorn uvicorn[standard]

# Criar arquivo de serviço systemd
sudo nano /etc/systemd/system/sic-backend.service
```

Conteúdo do arquivo `sic-backend.service`:
```ini
[Unit]
Description=SIC Dashboard FastAPI
After=network.target

[Service]
User=ec2-user
Group=ec2-user
WorkingDirectory=/var/www/sic-backend
Environment="PATH=/home/ec2-user/.local/bin"
ExecStart=/home/ec2-user/.local/bin/gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Habilitar e iniciar serviço
sudo systemctl daemon-reload
sudo systemctl enable sic-backend
sudo systemctl start sic-backend

# Verificar status
sudo systemctl status sic-backend
```

## 8. Deploy do Frontend

```bash
# Criar diretório para frontend
sudo mkdir -p /var/www/sic-frontend
sudo chown ec2-user:ec2-user /var/www/sic-frontend

# Clonar/upload código frontend
cd /var/www/sic-frontend
# Upload dos arquivos ou git clone

# Configurar variável de ambiente
echo "VITE_API_BASE_URL=http://seu-dominio.com/api" > .env
# OU para IP:
# echo "VITE_API_BASE_URL=http://seu-ip-publico/api" > .env

# Instalar dependências
npm install

# Build do projeto
npm run build

# Mover arquivos build para nginx
sudo cp -r dist/* /var/www/html/
# OU criar diretório específico:
sudo mkdir -p /var/www/sic-dashboard
sudo cp -r dist/* /var/www/sic-dashboard/
sudo chown -R nginx:nginx /var/www/sic-dashboard
```

## 9. Configurar Nginx

```bash
# Backup da configuração original
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup

# Criar configuração para SIC Dashboard
sudo nano /etc/nginx/conf.d/sic-dashboard.conf
```

Conteúdo do arquivo `sic-dashboard.conf`:
```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;  # OU seu IP público
    
    # Frontend
    location / {
        root /var/www/sic-dashboard;
        try_files $uri $uri/ /index.html;
        
        # Headers para SPA
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }
    
    # API Backend
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization";
        
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }
    
    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        root /var/www/sic-dashboard;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Testar configuração Nginx
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

## 10. Configurar SSL (Opcional mas Recomendado)

```bash
# Instalar Certbot
sudo dnf install -y python3-certbot-nginx

# Obter certificado SSL
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com

# Verificar renovação automática
sudo systemctl enable --now certbot-renew.timer
```

## 11. Configurar Firewall

```bash
# Configurar firewall local (iptables/firewalld)
sudo systemctl start firewalld
sudo systemctl enable firewalld

# Abrir portas necessárias
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-port=8000/tcp
sudo firewall-cmd --reload
```

## 12. Scripts de Manutenção

Criar script para backup do banco:
```bash
# Criar script de backup
sudo nano /usr/local/bin/backup-sic.sh
```

Conteúdo do script:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ec2-user/backups"
mkdir -p $BACKUP_DIR

# Backup MySQL
mysqldump -u sic_user -p sic_dashboard > $BACKUP_DIR/sic_dashboard_$DATE.sql

# Manter apenas backups dos últimos 7 dias
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete

echo "Backup completed: sic_dashboard_$DATE.sql"
```

```bash
# Tornar executável
sudo chmod +x /usr/local/bin/backup-sic.sh

# Adicionar ao cron para backup diário
crontab -e
# Adicionar linha:
# 0 2 * * * /usr/local/bin/backup-sic.sh
```

## 13. Monitoramento e Logs

```bash
# Ver logs do backend
sudo journalctl -u sic-backend -f

# Ver logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Verificar status dos serviços
sudo systemctl status nginx
sudo systemctl status sic-backend
sudo systemctl status mariadb
```

## 14. Comandos Úteis para Manutenção

```bash
# Reiniciar backend após mudanças
sudo systemctl restart sic-backend

# Atualizar frontend
cd /var/www/sic-frontend
git pull  # ou upload de novos arquivos
npm run build
sudo cp -r dist/* /var/www/sic-dashboard/

# Verificar uso de recursos
htop
df -h
free -h

# Ver conexões ativas
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :8000
```

## Troubleshooting

### Backend não inicia:
```bash
# Verificar logs
sudo journalctl -u sic-backend -n 50

# Testar manualmente
cd /var/www/sic-backend
python3 main.py
```

### Frontend não carrega:
```bash
# Verificar permissões
sudo chown -R nginx:nginx /var/www/sic-dashboard

# Verificar configuração Nginx
sudo nginx -t
```

### Problemas de CORS:
- Verificar se `VITE_API_BASE_URL` está correto no frontend
- Verificar configuração CORS no Nginx
- Verificar se backend está rodando na porta 8000

### Banco de dados:
```bash
# Conectar ao MySQL
mysql -u sic_user -p sic_dashboard

# Verificar se serviço está rodando
sudo systemctl status mariadb
```

## URLs de Acesso

Após deploy completo:
- **Frontend:** `http://seu-dominio.com` ou `http://seu-ip-publico`
- **API:** `http://seu-dominio.com/api` ou `http://seu-ip-publico/api`
- **Documentação API:** `http://seu-dominio.com/api/docs`

## Credenciais Padrão

- **Email:** admin@sic.com
- **Senha:** admin123

**IMPORTANTE:** Altere a senha após primeiro login!
