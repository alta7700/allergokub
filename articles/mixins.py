class StuffQuerysetMixin:

    def get_queryset(self):
        queryset = self.queryset
        if self.request.user.is_staff:
            return queryset.all()
        return queryset.filter(published=True)
