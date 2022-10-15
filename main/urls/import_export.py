from django.urls import path, include
from main import views


urlpatterns = [
    path('import/pollenday/', views.ImportCalendarDayView.as_view(), name='import_calendar')
]
