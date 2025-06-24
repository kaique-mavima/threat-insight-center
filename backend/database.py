
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# Configuração do banco de dados
# Para MySQL: "mysql+pymysql://user:password@localhost/database_name"
# Para SQLite (desenvolvimento): "sqlite:///./sic_dashboard.db"
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sic_dashboard.db")

engine = create_engine(
    DATABASE_URL,
    echo=True  # Remove em produção
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
