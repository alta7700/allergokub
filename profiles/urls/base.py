from django.urls import path, include


urlpatterns = [
    path('', include('profiles.urls.djoser_upgrade')),
    path('', include('djoser.urls.jwt')),
]
