import json
import os
import django

# Configuración de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vulnet_proj.settings')  # Reemplaza 'myproject.settings'
django.setup()

from vulnet_app.models import Device

def importar_dispositivos():
    try:
        with open('dispositivos.json', 'r', encoding='utf-8') as archivo:
            dispositivos = json.load(archivo)

            for dispositivo in dispositivos:
                try:
                    # Comprobar si el dispositivo ya existe en la base de datos
                    if not Device.objects.filter(model=dispositivo['model']).exists():
                        device = Device(
                            model=dispositivo['model'],
                            type=dispositivo['type'],
                            category=dispositivo['category']
                        )
                        device.save()  # Guardar el dispositivo en la base de datos
                        print(f"Dispositivo {dispositivo['model']} importado correctamente.")
                    else:
                        print(f"Dispositivo {dispositivo['model']} ya existe en la base de datos.")
                except django.db.IntegrityError as e:
                    print(f"Error de integridad en el dispositivo {dispositivo['model']}: {e}")
                except Exception as e:
                    print(f"Error al procesar dispositivo {dispositivo['model']}: {e}")
    except Exception as e:
        print(f"Error al abrir el archivo JSON: {e}")

# Ejecutar la función para importar los dispositivos
importar_dispositivos()