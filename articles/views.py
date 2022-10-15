from rest_framework import generics

from .mixins import StuffQuerysetMixin
from .models import Article
from .serializers import ArticlesListSerializer, ArticleSerializer, TilesListSerializer, TileSerializer,\
    AllergensListSerializer
from main.mixins import ResponseCacheMixin


ARTICLE_SERIALIZERS = {
    'news': {},
    'tiles': {'list': TilesListSerializer, 'detail': TileSerializer},
    'projects': {},
    'allergens': {'list': AllergensListSerializer},
}


class ArticlesListAPIView(ResponseCacheMixin, generics.ListAPIView):
    queryset = Article.objects.filter(published=True)
    serializer_class = ArticlesListSerializer

    def get_category_name(self):
        category = self.request.GET.get('category')
        return category if category else 'articles'

    def get_serializer_class(self):
        category = self.get_category_name()
        if category in ARTICLE_SERIALIZERS:
            serializer = ARTICLE_SERIALIZERS[category].get('list')
            if serializer:
                return serializer
        return self.serializer_class

    def get_cache_key_title(self, request, *args, **kwargs):
        return f'{self.get_category_name()}_list'

    def get_queryset(self):
        queryset = self.queryset
        category = self.get_category_name()
        category = Article.URL_MAPPING_REVERSE.get(category)
        if category:
            return queryset.filter(article_type=category)
        return queryset.all()

    def get_data(self, request, *args, **kwargs):
        return self.get_serializer(self.filter_queryset(self.get_queryset()), many=True).data


class ArticleDetailAPIView(StuffQuerysetMixin, ResponseCacheMixin, generics.RetrieveAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

    def get_category_name(self):
        category = self.request.GET.get('category')
        return category if category else 'article'

    def get_serializer_class(self):
        category = self.get_category_name()
        if category in ARTICLE_SERIALIZERS:
            serializer = ARTICLE_SERIALIZERS[category].get('detail')
            if serializer:
                return serializer
        return self.serializer_class

    def get_cache_key_title(self, request, *args, **kwargs):
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        category = self.get_category_name()
        return f'{category}_{lookup_url_kwarg}_{kwargs[lookup_url_kwarg]}'

    def get_queryset(self):
        queryset = super(ArticleDetailAPIView, self).get_queryset()
        category = self.get_category_name()
        category = Article.URL_MAPPING_REVERSE.get(category)
        if category:
            return queryset.filter(article_type=category)
        return queryset

    def get_data(self, request, *args, **kwargs):
        return self.get_serializer(self.get_object()).data


class ArticleIDAPIView(ArticleDetailAPIView):
    lookup_field = 'id'
    lookup_url_kwarg = 'id'


class ArticleSlugAPIView(ArticleDetailAPIView):
    lookup_field = 'slug'
    lookup_url_kwarg = 'slug'
