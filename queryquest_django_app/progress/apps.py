from django.apps import AppConfig


class ProgressConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'progress'

    def ready(self):
        import progress.signals  # Import the signals when the app is ready


