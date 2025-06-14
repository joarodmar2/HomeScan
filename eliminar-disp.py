import os
import django

# Configurar entorno de Django ANTES de importar modelos
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'homeScan_proj.settings')
django.setup()

# Ahora sí puedes importar modelos
from homeScan_app.models import Device

# Eliminar todos los dispositivos
Device.objects.all().delete()
print("Todos los dispositivos han sido eliminados de la base de datos.")
