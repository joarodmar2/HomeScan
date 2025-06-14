import json
import os
import django

# Configuración de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'homeScan_proj.settings')  # Reemplaza 'myproject.settings'
django.setup()

from homeScan_app.models import Device

import time

def importar_dispositivos(batch_size=4, delay=31):
    with open('dispositivos.json', 'r', encoding='utf-8') as archivo:
        dispositivos = json.load(archivo)

        total = len(dispositivos)
        for i in range(0, total, batch_size):
            lote = dispositivos[i:i + batch_size]

            for dispositivo in lote:
                try:
                    if not Device.objects.filter(model=dispositivo['model']).exists():
                        device = Device(
                            model=dispositivo['model'],
                            type=dispositivo['type'],
                            category=dispositivo['category']
                        )
                        device.save()  # Esto dispara la llamada a la API
                        print(f"Dispositivo {dispositivo['model']} importado.")
                    else:
                        print(f"Dispositivo {dispositivo['model']} ya existe.")
                except Exception as e:
                    print(f"Error con {dispositivo['model']}: {e}")

            if i + batch_size < total:
                print(f"Esperando {delay}s antes del siguiente lote...")
                time.sleep(delay)


# Ejecutar la función para importar los dispositivos
importar_dispositivos()