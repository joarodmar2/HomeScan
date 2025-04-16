from rest_framework import serializers
from .models import Device,Vulnerability,Connection,ConnectionVulnerability, Estancia,formularioObject, Mueble

#El serializer en Django REST Framework sirve para convertir entre objetos de Django (modelos) y formatos como JSON, 
# que puedes enviar o recibir desde el frontend.


class VulnerabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Vulnerability
        fields = '__all__'

class DeviceSerializer(serializers.ModelSerializer):
    vulnerabilities = VulnerabilitySerializer(many=True, required=False)
    class Meta:
        model = Device
        fields = '__all__'

class ConnectionVulnerabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = ConnectionVulnerability
        fields = '__all__'

class ConnectionSerializer(serializers.ModelSerializer):
    connectionvulnerabilities = ConnectionVulnerabilitySerializer(many=True, required=False)
    first_device = DeviceSerializer()
    second_device = DeviceSerializer()
    class Meta:
        model = Connection
        fields = '__all__'

class EstanciaSerializer(serializers.ModelSerializer):
    dispositivos = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Device.objects.all()
    )

    class Meta:
        model = Estancia
        fields = ['id', 'nombreEstancia', 'dispositivos']
        
class ObjectSerializer(serializers.ModelSerializer):
    first_device = DeviceSerializer()
    second_device = DeviceSerializer()
    third_device = DeviceSerializer()
    class Meta:
        model = formularioObject
        fields = '__all__'

class MuebleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mueble
        fields = '__all__'  # Incluye todos los campos del modelo