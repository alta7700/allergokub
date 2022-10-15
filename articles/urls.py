from django.urls import path
from . import views


urlpatterns = [
    path('detail/<int:id>/', views.ArticleIDAPIView.as_view(), name='article_detail_id'),
    path('detail/<slug:slug>/', views.ArticleSlugAPIView.as_view(), name='article_detail_slug'),
    path('list/', views.ArticlesListAPIView.as_view(), name='articles_list'),
]
