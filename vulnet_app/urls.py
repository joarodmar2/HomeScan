from django.urls import include, path
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
from vulnet_app import views
from .views import EstanciaView,buscar_dispositivos,OSVVulnerabilityView

router = routers.DefaultRouter()
router.register(r"devices", views.DeviceView, "devices")
router.register(r"vulnerabilities", views.VulnerabilityView, "vulnerabilities")
router.register(r"connections", views.ConnectionView, "connections")
router.register(r"connectionvulnerabilities", views.ConnectionVulnerabilityView, "connectionvulnerabilities")

#router.register(r"Estancia", views.Estancia, "estancia") # Si lo activo salta error 
router.register(r"objects", views.ObjectView, "objects")

urlpatterns = [
    path("api/v1/", include(router.urls)),
    path('docs/', include_docs_urls(title='Devices API')),
    path('api/v1/ndevnvuln/', views.NdevNvuln.as_view(), name="ndevnvuln"),
    path('api/v1/nseverity/', views.NSeverity.as_view(), name="nseverity"),
    path('api/v1/nseveritysummary/', views.NSeveritySummary.as_view(), name="nseveritysummary"),
    path('api/v1/nseveritysummarylist/', views.NSeveritySummaryList.as_view(), name="nseveritysummarylist"),
    path('api/v1/weightedaverage/', views.WeightedAverage.as_view(), name="weightedaverage"),
    path('api/v1/devicevulnerabilities/<str:model>/', views.DeviceVulnerabilities.as_view(), name="devicevulnerabilities"),
    path('api/v1/deviceweightedaverage/<str:model>/', views.DeviceWeightedAverage.as_view(), name="deviceweightedaverage"),
    path('api/v1/vulnerability/<str:name>/', views.VulnerabilityValues.as_view(), name="vulnerability"),
    path('api/v1/risk/<str:value>/', views.Risk.as_view(), name="risk"),
    path('api/v1/averagesustainability/', views.AverageSustainability.as_view(), name="sustainability"),
    path('api/v1/devicesustainability/<str:model>/', views.DeviceSustainability.as_view(), name="devicesustainability"),
    path('api/v1/createconnection/', views.CreateConnection.as_view(), name="createconnection"),
    path('api/v1/updateconnection/<int:id>/', views.UpdateConnection.as_view(), name="updateconnection"),
    

    path('api/v1/devicemodels/', views.getDeviceModels.as_view(), name="devicemodels"),
    path('api/v1/devicetypes/', views.getDeviceTypes.as_view(), name="devicetypes"),
    path('api/v1/devicapabilities/', views.getDeviceCapabilities.as_view(), name="devicapabilities"),
    path('api/v1/connectionprotocols/', views.getConnectionProtocols.as_view(), name="connectionprotocols"),
    path('api/v1/connectiongraph/', views.getConnectionGraph.as_view(), name="connectiongraph"),
    path("api/v1/Estancia/", EstanciaView.as_view(), name="Estancia_list"),
    path("api/v1/Estancia/<int:pk>/", EstanciaView.as_view(), name="Estancia_detail"),

    path("api/v1/Estancia/nombre/<str:nombreEstancia>/", EstanciaView.as_view(), name="estancia_por_nombre"),

    path('api/buscar-dispositivo/', buscar_dispositivos, name='buscar_dispositivo'),

    path('api/v1/createobject/', views.CreateObject.as_view(), name="createObject"),
    path('api/v1/deleteobject/<int:pk>/', views.DeleteObject.as_view(), name="deleteObject"),
    path('api/v1/updateobject/<int:id>/', views.updateObject.as_view(), name="updateObject"),
    path('api/v1/vulnerabilities/<str:ecosystem>/<str:package_name>/', OSVVulnerabilityView.as_view(), name='osv_vulnerabilities'),
    


]