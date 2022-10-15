from main.utils.cache_decorator import cache_decorator
from rest_framework.response import Response


class ResponseCacheMixin:
    cache_key_title = None
    cache_ttl = None

    def get_cache_key_title(self, request, *args, **kwargs):
        return self.cache_key_title

    def get_cache_decorator_params(self, request, *args, **kwargs):
        params = [self.get_cache_key_title(request, *args, **kwargs)]
        if self.cache_ttl:
            params.append(self.cache_ttl)
        return params

    def get(self, request, *args, **kwargs):
        if self.get_cache_key_title(request, *args, **kwargs):
            data = cache_decorator(
                *self.get_cache_decorator_params(request, *args, **kwargs)
            )(self.get_data)(request, *args, **kwargs)
            if kwargs.get('get_data_only', False):
                return data
            return Response(data, status=200)
        return super().get(self, request, *args, **kwargs)

    def get_data(self, request, *args, **kwargs):
        """Override this method"""
        return {}
