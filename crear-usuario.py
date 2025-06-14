import os
import django

# Configura Django para acceder a los ajustes
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'homeScan_proj.settings')
django.setup()

from django.contrib.auth.models import User

# Crear un superusuario
user = User.objects.create_superuser('admin', 'admin', 'admin')
user.save()
print("Superusuario creado correctamente")
