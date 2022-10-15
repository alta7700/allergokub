from datetime import datetime
from django.db import models
from django.core.cache import cache


def article_cover_upload_path(instance, filename):
    return f'article_covers/{instance.id}.{filename.split(".")[-1]}'


class Article(models.Model):
    NEWS = 1
    TILE = 2
    PROJECT = 3
    ALLERGEN = 4

    ARTICLE_TYPES = (
        (NEWS, 'Новость'),
        (TILE, 'Плитки на главной'),
        (PROJECT, 'Проект'),
        (ALLERGEN, 'Описание аллергена')
    )

    URL_MAPPING = {
        NEWS: 'news',
        TILE: 'tiles',
        PROJECT: 'projects',
        ALLERGEN: 'allergens',
    }

    URL_MAPPING_REVERSE = {
        'news': NEWS,
        'tiles': TILE,
        'projects': PROJECT,
        'allergens': ALLERGEN,
    }

    article_type: int = models.IntegerField(verbose_name='Тип', choices=ARTICLE_TYPES, default=NEWS)
    title: str = models.CharField(verbose_name='Заголовок', max_length=50)
    slug: str = models.SlugField(max_length=50, unique=True)
    short_description: str = models.CharField(verbose_name='Краткое описание', max_length=200)
    cover = models.ImageField(verbose_name='Обложка', upload_to=article_cover_upload_path, null=True, blank=True)
    show_cover: bool = models.BooleanField(verbose_name='Показывать обложку в статье', default=False)
    creation_dt: datetime = models.DateTimeField(verbose_name='Дата и время создания', auto_now_add=True)
    update_dt: datetime = models.DateTimeField(verbose_name='Последнее изменение', auto_now=True)
    published: bool = models.BooleanField(verbose_name='Опубликовано', default=False)

    class Meta:
        verbose_name = 'Статья'
        verbose_name_plural = 'Статьи'
        ordering = ['article_type', 'published', 'creation_dt']

    def __str__(self):
        return self.title

    def get_blocks(self):
        return self.blocks.filter(hidden=False)

    @classmethod
    def get_article_with_related(cls):
        return cls.objects.prefetch_related('blocks', 'blocks__images').all()

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        cache.clear()
        super(Article, self).save(force_insert, force_update, using, update_fields)


class ArticleBlock(models.Model):
    TEXT = 1
    HEAD = 2
    IMAGE = 3
    CAROUSEL = 4
    VIDEO = 5
    CONTAINER = 6

    BLOCK_TYPES = (
        (TEXT, 'Текст'),
        (HEAD, 'Подзаголовок'),
        (IMAGE, 'Картинка'),
        (CAROUSEL, 'Карусель'),
        (VIDEO, 'Видео'),
        (CONTAINER, 'Контейнер для блоков'),
    )

    block_type: int = models.PositiveSmallIntegerField(verbose_name='Тип блока', choices=BLOCK_TYPES)
    article: Article = models.ForeignKey(verbose_name='Новость', to=Article, on_delete=models.CASCADE,
                                         related_name='blocks', null=True)
    container = models.ForeignKey(verbose_name='Родительский блок', to='self', on_delete=models.CASCADE,
                                  related_name='nested_blocks', null=True)
    position: int = models.SmallIntegerField(verbose_name='Порядок')
    text: str = models.TextField(verbose_name='Текст', blank=True)
    text_styles: str = models.TextField(verbose_name='Стили', blank=True)
    horizontal: bool = models.BooleanField(verbose_name='Блоки внутри горизонтально', default=False)
    hidden: bool = models.BooleanField(verbose_name='Скрытый', default=False)
    add_hr: bool = models.BooleanField(verbose_name='Разделитель под блоком', default=False)

    class Meta:
        verbose_name = 'Блок новости'
        verbose_name_plural = 'Блоки новостей'
        ordering = ['article', 'position']
        indexes = [
            models.Index(fields=('article',)),
            models.Index(fields=('container',)),
        ]
        unique_together = ('article', 'position')

    def __str__(self):
        return f'{self.position}. {self.get_block_type_label()}'

    def get_block_type_label(self):
        if self.block_type:
            return self.BLOCK_TYPES[self.block_type - 1][1]
        else:
            return 'Неопределенно'

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        cache.clear()
        super(ArticleBlock, self).save(force_insert, force_update, using, update_fields)


def get_img_upload_path(instance, filename, path=''):
    if instance.article:
        return f'block_images/{instance.article.id}/{path}'
    return get_img_upload_path(instance.container, filename, f'{instance.container.id}/{path}')


def block_image_upload_path(instance, filename):
    return get_img_upload_path(
        instance.block, filename, f'{instance.block.id}_{instance.position}.{filename.split(".")[-1]}'
    )


class BlockImage(models.Model):
    title: str = models.CharField(verbose_name='Название', max_length=40, blank=True)
    image = models.ImageField(verbose_name='Картинка', upload_to=block_image_upload_path)
    block: ArticleBlock = models.ForeignKey(verbose_name='Блок', to=ArticleBlock, on_delete=models.CASCADE,
                                            editable=False, related_name='images')
    position: int = models.PositiveSmallIntegerField(verbose_name='Порядок')

    class Meta:
        verbose_name = 'Картинка новости'
        verbose_name_plural = 'Картинки новостей'
        ordering = ['block', 'position']
        indexes = [
            models.Index(fields=('block',)),
        ]
        unique_together = ('block', 'position')

    def __str__(self):
        return self.title
