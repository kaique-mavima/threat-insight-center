
# API Backend - Documentação

## Visão Geral

O frontend está preparado para trabalhar com uma API REST que você pode implementar em qualquer tecnologia (Python/FastAPI, Node.js/Express, etc.).

## Configuração

Defina a variável de ambiente `VITE_API_BASE_URL` com o endereço da sua API:
```bash
VITE_API_BASE_URL=http://localhost:8000/api
```

## Endpoints Necessários

### Autenticação

```
POST /api/auth/login
Body: { "email": "string", "password": "string" }
Response: { "token": "string", "user": {...} }

POST /api/auth/logout
Headers: Authorization: Bearer <token>
Response: { "message": "success" }
```

### Usuários

```
GET /api/users
Headers: Authorization: Bearer <token>
Response: ApiUser[]

POST /api/users
Headers: Authorization: Bearer <token>
Body: { "name": "string", "email": "string", "password": "string", "role": "admin|user", "isActive": boolean }
Response: ApiUser

PUT /api/users/:id
Headers: Authorization: Bearer <token>
Body: Partial<ApiUser>
Response: ApiUser

DELETE /api/users/:id
Headers: Authorization: Bearer <token>
Response: { "message": "success" }
```

### Configurações

```
GET /api/configs?type=<configType>
Headers: Authorization: Bearer <token>
Response: ApiConfig[]

POST /api/configs
Headers: Authorization: Bearer <token>
Body: { "configType": "string", "config": {...} }
Response: ApiConfig

PUT /api/configs/:id
Headers: Authorization: Bearer <token>
Body: { "config": {...} }
Response: ApiConfig

DELETE /api/configs/:id
Headers: Authorization: Bearer <token>
Response: { "message": "success" }
```

## Tipos de Dados

### ApiUser
```typescript
{
  id: string;
  name: string;
  email: string;
  password: string; // hash
  role: 'admin' | 'user';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}
```

### ApiConfig
```typescript
{
  id: string;
  userId: string;
  configType: 'jira' | 'google_sheets' | 'google_maps' | 'slack' | 'teams' | 'telegram' | 'smtp';
  config: any; // JSON object
  createdAt: string;
  updatedAt: string;
}
```

## Schema do Banco de Dados (MySQL)

```sql
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

## Exemplo de Implementação Python/FastAPI

```python
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import bcrypt
import jwt

app = FastAPI()

@app.post("/api/auth/login")
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not bcrypt.checkpw(credentials.password.encode(), user.password.encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = jwt.encode({"user_id": user.id}, SECRET_KEY, algorithm="HS256")
    return {"token": token, "user": user}

@app.get("/api/users")
def get_users(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return db.query(User).all()
```

## Fallback

O frontend possui fallback automático para localStorage caso a API não esteja disponível, garantindo que o sistema continue funcionando durante o desenvolvimento.
