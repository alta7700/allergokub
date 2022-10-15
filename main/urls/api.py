from django.urls import path, include
from main import views


urlpatterns = [
    path('articles/', include('articles.urls')),
    path('auth/', include('profiles.urls')),
    path('team/', views.TeamMembersAPIView.as_view(), name='members'),
    path('allergens/list/', views.AllergenListAPIView.as_view(), name='allergens_list'),
    path('allergens/allergometr/', views.AllergoMetrAPIView.as_view(), name='allergometr'),
    path('allergens/calendar/', views.DateRangePollenAPIView.as_view(), name='calendar'),
]
