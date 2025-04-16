
from django.db import models

# Create your models here.
class Device(models.Model):
    model = models.TextField(blank=False, unique=True)
    type = models.TextField(blank=False)
    category = models.TextField(blank=False)
    
    def __str__(self):
        return self.model
    

class Vulnerability(models.Model):
    name = models.TextField()
    description = models.TextField()
    baseSeverity = models.TextField()
    version = models.FloatField()
    cvss=models.FloatField()
    explotability=models.FloatField()
    impact=models.FloatField()
    cwe = models.TextField()
    vector= models.TextField()
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name="vulnerabilities")

    def __str__(self):
       return str(self.name)


class Connection(models.Model):
    type = models.TextField(blank=False)
    first_device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name="firstdevice")
    second_device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name="seconddevice")

    def __str__(self):
            return self.type


class ConnectionVulnerability(models.Model):
    name = models.TextField()
    description = models.TextField()
    baseSeverity = models.TextField()
    version = models.FloatField()
    cvss=models.FloatField()
    explotability=models.FloatField()
    impact=models.FloatField()
    cwe = models.TextField()
    vector= models.TextField()
    connection = models.ForeignKey(Connection, on_delete=models.CASCADE, related_name="connectionvulnerabilities")

    def __str__(self):
       return str(self.name)
    
from django.db import models

class Estancia(models.Model):
    nombreEstancia = models.CharField(max_length=100, unique=True)
    dispositivos = models.ManyToManyField(Device, related_name="estancias", blank=True)

    def __str__(self):
        return self.nombreEstancia

class Mueble(models.Model):
    estancia = models.ForeignKey(Estancia, on_delete=models.CASCADE, related_name="muebles")
    tipo = models.CharField(max_length=50)  # Tipo libre
    x = models.IntegerField(blank=True, null=True)               # Posición X en el canvas
    y = models.IntegerField(blank=True, null=True)               # Posición Y en el canvas
    width = models.IntegerField()           # Ancho del mueble
    height = models.IntegerField()          # Alto del mueble
    rotation = models.FloatField()          # Rotación en grados
    imagen = models.ImageField(upload_to="muebles/", null=True, blank=True)  # Imagen opcional
    visible = models.BooleanField(default=False)  # 👈 NUEVO CAMPO

    def __str__(self):
        return f"{self.tipo} ({self.x}, {self.y})"


class formularioObject(models.Model):
    name = models.TextField(blank=False)
    type = models.TextField(blank=False)
    first_device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name="formfirstdevice")
    second_device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name="formseconddevice")
    third_device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name="formthirddevice",null=True,
    blank=True)

    def __str__(self):
       return str(self.name)
    
