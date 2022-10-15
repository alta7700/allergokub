from django.core.cache import cache
from django.conf import settings
from django.core.cache.backends.base import DEFAULT_TIMEOUT

CACHE_TTL = getattr(settings, 'CACHE_TTL', DEFAULT_TIMEOUT)


def cache_decorator(data_key, cache_time=CACHE_TTL):
    def decorator(func):
        def wrapper(*args, **kwargs):
            if data_key in cache:
                data = cache.get(data_key)
            else:
                data = func(*args, **kwargs)
                cache.set(data_key, data, timeout=cache_time)
            return data
        return wrapper
    return decorator
