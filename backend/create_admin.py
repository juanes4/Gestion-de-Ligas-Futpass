"""Crea un usuario administrador para acceder al dashboard.

Uso: python create_admin.py "<nombre>" <email> <contraseña>
"""
import sys

from src.database import init_db
from src.routes import registrar_usuario

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print(__doc__)
        sys.exit(1)

    init_db()
    resultado = registrar_usuario(*sys.argv[1:])
    print(resultado["message"])
    sys.exit(0 if resultado["success"] else 1)
