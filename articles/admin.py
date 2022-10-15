from django.contrib import admin, messages
from django.http import HttpResponseRedirect
from django.utils.safestring import mark_safe
from .models import *
from .forms import ArticleBlockAdminForm


class InlineArticleBlock(admin.StackedInline):
    model = ArticleBlock
    extra = 0
    show_change_link = True
    fields = ('hidden', 'add_hr', 'text', 'text_styles', 'get_content')
    readonly_fields = ('text', 'text_styles', 'get_content')
    max_num = 0

    def get_content(self, obj):
        if obj.block_type in (obj.IMAGE, obj.CAROUSEL):
            images_html = []
            for img in obj.images.all():
                images_html.append(f'<div style="display:flex;flex-direction:column;align-items:center;margin:10px 0"><p style="font-size:20px">{img.title}</p><img src={img.image.url} style="width:500px">')
            if images_html:
                return mark_safe(''.join(images_html))
        elif obj.block_type == obj.VIDEO:
            return mark_safe(obj.text)
        return '-------'
    get_content.short_description = 'Контент'


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'creation_dt', 'update_dt', 'published')
    list_display_links = list_display
    search_fields = ('title', )
    list_filter = ('published', 'article_type')
    inlines = [InlineArticleBlock]
    prepopulated_fields = {'slug': ('title', )}
    change_form_template = 'main/admin/advanced_change_view.html'
    readonly_fields = ('creation_dt', 'update_dt', 'cover_preview', 'published')

    def cover_preview(self, obj):
        return mark_safe(f'<img src={obj.cover.url} margin=10px width="500px">') if obj.cover else '-------'

    def get_fieldsets(self, request, obj=None):
        fields = 'article_type', 'title', 'slug', 'short_description'
        if obj:
            return (
                ('Основная информация', {'fields': (*fields, 'cover', 'show_cover', 'cover_preview')}),
                ('Дополнительная информация', {'fields': ('creation_dt', 'update_dt', 'published')})
            )
        return (
            ('Основная информация', {'fields': fields}),
        )

    def render_change_form(self, request, context, add=False, change=False, form_url="", obj=None):
        if change:
            submit_row = [{'title': 'Добавить блок', 'action': '_add_block_to_article'}]
            if obj.published:
                submit_row.append({'title': 'Снять с публикации', 'action': '_make_unpublished'})
            else:
                submit_row.append({'title': 'Опубликовать', 'action': '_make_published'})
            context['custom_buttons'] = submit_row

            context['custom_object_tools_items'] = [
                {'title': 'Посмотреть на сайте', 'url': f'/{obj.URL_MAPPING[obj.article_type]}/{obj.slug}/'}
            ]

        return super(ArticleAdmin, self).render_change_form(request, context, add, change, form_url, obj)

    def change_view(self, request, object_id, form_url="", extra_context=None):
        if '_add_block_to_article' in request.POST:
            return HttpResponseRedirect(f'/admin/articles/articleblock/add/?article={object_id}')
        return super(ArticleAdmin, self).change_view(request, object_id, form_url, extra_context)

    def response_post_save_change(self, request, obj):
        if '_make_published' in request.POST:
            if not obj.cover:
                self.message_user(request, f'Новость {obj.title} не опубликована, нет обложки', messages.ERROR)
                return HttpResponseRedirect(f'/admin/articles/article/{obj.id}/change/')
            elif not obj.blocks.all():
                self.message_user(request, f'Новость {obj.title} не опубликована, нет ни одного блока', messages.ERROR)
                return HttpResponseRedirect(f'/admin/articles/article/{obj.id}/change/')
            else:
                obj.published = True
                obj.save()
                self.message_user(request, f'Новость "{obj.title}" опубликована', messages.SUCCESS)
        elif '_make_unpublished' in request.POST:
            obj.published = False
            obj.save()
        return super(ArticleAdmin, self).response_post_save_change(request, obj)


class InlineBlockImage(admin.StackedInline):
    model = BlockImage
    extra = 1
    fields = ('title', 'image', 'position', 'get_image')
    readonly_fields = ('get_image', )

    def get_min_num(self, request, obj=None, **kwargs):
        if obj.block_type in (obj.IMAGE, obj.CAROUSEL):
            return 1
        return 0

    def get_max_num(self, request, obj=None, **kwargs):
        if obj.block_type == obj.IMAGE:
            return 1
        elif obj.block_type == obj.CAROUSEL:
            return 1000
        return 0

    def get_image(self, obj):
        return mark_safe(f'<img src={obj.image.url} width="500px">')
    get_image.short_description = 'Изображение'


@admin.register(ArticleBlock)
class ArticleBlockAdmin(admin.ModelAdmin):
    list_display = ('article', 'position', 'block_type')
    list_display_links = list_display
    search_fields = ('article__title', )
    form = ArticleBlockAdminForm
    change_form_template = 'main/admin/advanced_change_view.html'

    def get_inlines(self, request, obj):
        if obj:
            if obj.block_type in (obj.IMAGE, obj.CAROUSEL):
                return [InlineBlockImage]
            if obj.block_type == obj.CONTAINER:
                return [InlineArticleBlock]
        return []

    def get_fieldsets(self, request, obj=None):
        if obj:
            block_type = obj.block_type
            fields = ['block_type', 'position', 'hidden', 'add_hr', 'text']
            if block_type == obj.IMAGE:
                return (
                    (None, {'fields': fields}),
                )
            elif block_type in (obj.TEXT, obj.HEAD):
                return (
                    (None, {'fields': (*fields, 'text_styles')}),
                )
            elif block_type == obj.VIDEO:
                return (
                    (None, {'fields': (*fields, 'video_preview')}),
                )
            elif block_type == obj.CAROUSEL:
                return (
                    (None, {'fields': fields}),
                )
            elif block_type == obj.CONTAINER:
                return (
                    (None, {'fields': (*fields, 'horizontal')}),
                )
        else:
            if 'article' in request.GET:
                return (
                    (None, {'fields': ('block_type', 'position',)}),
                    (None, {'fields': ('article',), 'classes': ('empty-form',)})
                )
            elif 'container' in request.GET:
                return (
                    (None, {'fields': ('block_type', 'position',)}),
                    (None, {'fields': ('container', ), 'classes': ('empty-form', )})
                )

    def video_preview(self, obj):
        if obj.block_type == obj.VIDEO:
            return mark_safe(obj.text)
        return '-'

    def get_readonly_fields(self, request, obj=None):
        if obj:
            if obj.block_type == obj.VIDEO:
                return ('block_type', 'video_preview')
            return ('block_type', )
        return []

    def get_changeform_initial_data(self, request):
        initial_data = super(ArticleBlockAdmin, self).get_changeform_initial_data(request)
        values = {}
        if 'article' in request.GET:
            values['article'] = request.GET.get('article')
        elif 'container' in request.GET:
            values['container'] = request.GET.get('container')
        return {**initial_data, **values}

    def render_change_form(self, request, context, add=False, change=False, form_url="", obj=None):
        if change and obj.block_type == obj.CONTAINER:
            submit_row = [{'title': 'Добавить блок', 'action': '_add_block_to_container'}]
            context['custom_buttons'] = submit_row
        return super(ArticleBlockAdmin, self).render_change_form(request, context, add, change, form_url, obj)

    def change_view(self, request, object_id, form_url="", extra_context=None):
        if '_add_block_to_container' in request.POST:
            return HttpResponseRedirect(f'/admin/articles/articleblock/add/?container={object_id}')
        return super(ArticleBlockAdmin, self).change_view(request, object_id, form_url, extra_context)

    def has_module_permission(self, request):
        return False

    def has_add_permission(self, request):
        if 'article' in request.GET or 'container' in request.GET:
            return True
        return False

    def response_post_save_add(self, request, obj):
        return HttpResponseRedirect(f'/admin/articles/articleblock/{obj.id}/change/')

    def response_post_save_change(self, request, obj):
        if obj.container:
            return HttpResponseRedirect(f'/admin/articles/articleblock/{obj.container.id}/change/')
        else:
            return HttpResponseRedirect(f'/admin/articles/article/{obj.article.id}/change/')


