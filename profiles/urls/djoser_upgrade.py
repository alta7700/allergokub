from rest_framework.routers import DefaultRouter
from profiles import views

router = DefaultRouter()
router.register("users", views.CustomUserViewSet)

urlpatterns = router.urls
