from django.apps import AppConfig

class VulnetAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'homeScan_app'

    def ready(self):
        import homeScan_app.signals