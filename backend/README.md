
# SIC Dashboard Backend API

Backend em Python/FastAPI para o SIC Dashboard.

## Instalação

1. **Instalar dependências:**
```bash
pip install -r requirements.txt
```

2. **Configurar banco de dados:**
```bash
# Copiar arquivo de configuração
cp .env.example .env

# Editar .env com suas configurações de banco
```

3. **Para MySQL:**
```bash
# Instalar PyMySQL
pip install pymysql

# Configurar DATABASE_URL no .env:
DATABASE_URL=mysql+pymysql://usuario:senha@localhost:3306/sic_dashboard
```

4. **Criar usuário administrador:**
```bash
python create_admin.py
```

## Executar

```bash
# Desenvolvimento
python main.py

# Ou com uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Usuários
- `GET /api/users` - Listar usuários (admin)
- `POST /api/users` - Criar usuário (admin)
- `PUT /api/users/{id}` - Atualizar usuário
- `DELETE /api/users/{id}` - Deletar usuário (admin)

### Configurações
- `GET /api/configs` - Listar configurações do usuário
- `GET /api/configs?type=slack` - Filtrar por tipo
- `POST /api/configs` - Criar/atualizar configuração
- `PUT /api/configs/{id}` - Atualizar configuração
- `DELETE /api/configs/{id}` - Deletar configuração

## Usuário Padrão

Após executar `create_admin.py`:
- **Email:** admin@sic.com
- **Senha:** admin123

**IMPORTANTE:** Altere a senha após o primeiro login!

## Schema MySQL

```sql
CREATE DATABASE sic_dashboard;
USE sic_dashboard;

CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE configs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    config_type VARCHAR(50) NOT NULL,
    config JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_config (user_id, config_type)
);
```

## Deploy

### Railway
1. Conecte seu repositório
2. Configure as variáveis de ambiente
3. Deploy automático

### Heroku
```bash
# Adicionar Procfile
echo "web: uvicorn main:app --host=0.0.0.0 --port=\$PORT" > Procfile

# Deploy
git add .
git commit -m "Initial backend"
heroku create seu-app-name
git push heroku main
```

## Configurar Frontend

No frontend Lovable, configure a variável de ambiente:
```
VITE_API_BASE_URL=http://localhost:8000/api
```

Para produção:
```
VITE_API_BASE_URL=https://seu-backend.railway.app/api
```
