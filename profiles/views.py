from djoser.views import UserViewSet


class CustomUserViewSet(UserViewSet):

    def perform_update(self, serializer):
        serializer.save()
