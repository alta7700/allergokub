from django.http import Http404
from django.views.generic.detail import SingleObjectMixin, SingleObjectTemplateResponseMixin, DetailView
from django.views import View


class RequestBasedSingleObjectMixin(SingleObjectMixin):

    def get_object(self, request=None, queryset=None):
        queryset = self.get_queryset(request)

        pk = self.kwargs.get(self.pk_url_kwarg)
        slug = self.kwargs.get(self.slug_url_kwarg)
        if pk is not None:
            queryset = queryset.filter(pk=pk)
        if slug is not None and (pk is None or self.query_pk_and_slug):
            slug_field = self.get_slug_field()
            queryset = queryset.filter(**{slug_field: slug})
        if pk is None and slug is None:
            raise AttributeError(
                "Generic detail view %s must be called with either an object "
                "pk or a slug in the URLconf." % self.__class__.__name__
            )

        try:
            obj = queryset.get()
        except queryset.model.DoesNotExist:
            raise Http404("Новость не найдена")
        return obj

    def get_queryset(self, request=None):
        return super(RequestBasedSingleObjectMixin, self).get_queryset()


class BaseRequestBasedDetailView(RequestBasedSingleObjectMixin, View):

    def get(self, request, *args, **kwargs):
        self.object = self.get_object(request)
        context = self.get_context_data(object=self.object)
        return self.render_to_response(context)


class RequestBasedDetailView(SingleObjectTemplateResponseMixin, BaseRequestBasedDetailView):
    pass
