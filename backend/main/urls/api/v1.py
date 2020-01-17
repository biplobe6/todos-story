from django.urls import path, include


urlpatterns = [
    path('', include('core.urls.v1'), name='core'),
]
