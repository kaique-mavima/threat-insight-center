
#!/usr/bin/env python3
"""
Script para criar usuário administrador inicial
"""
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, User
from auth import get_password_hash

# Criar as tabelas
Base.metadata.create_all(bind=engine)

def create_admin_user():
    db = SessionLocal()
    
    try:
        # Verificar se já existe um admin
        existing_admin = db.query(User).filter(User.role == "admin").first()
        if existing_admin:
            print("Usuário administrador já existe!")
            print(f"Email: {existing_admin.email}")
            return
        
        # Criar usuário admin
        admin_user = User(
            name="Administrador",
            email="admin@sic.com",
            password=get_password_hash("admin123"),
            role="admin",
            is_active=True
        )
        
        db.add(admin_user)
        db.commit()
        
        print("Usuário administrador criado com sucesso!")
        print("Email: admin@sic.com")
        print("Senha: admin123")
        print("IMPORTANTE: Altere a senha após o primeiro login!")
        
    except Exception as e:
        print(f"Erro ao criar usuário administrador: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()
