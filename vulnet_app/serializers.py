from rest_framework import serializers
<<<<<<< HEAD
from .models import Device,Vulnerability,Connection,ConnectionVulnerability, Estancia
=======
from .models import Device,Vulnerability,Connection,ConnectionVulnerability,formularioObject
>>>>>>> 85ed67ec0d369877cf5ceec02c671961df1a8346



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

<<<<<<< HEAD
class EstanciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estancia
=======
class ObjectSerializer(serializers.ModelSerializer):
    first_device = DeviceSerializer()
    second_device = DeviceSerializer()
    third_device = DeviceSerializer()
    class Meta:
        model = formularioObject
>>>>>>> 85ed67ec0d369877cf5ceec02c671961df1a8346
        fields = '__all__'