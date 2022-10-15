from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import TeamMember, Allergen, PollenCalendar


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('position', 'fio', 'post', 'show', 'image_preview')
    list_display_links = ('position', 'fio', 'post')
    fields = ('fio', 'post', 'short_description', 'position', 'show', 'image', 'big_image_preview')
    readonly_fields = ('big_image_preview',)

    def image_preview(self, obj):
        return mark_safe(f'<img src={obj.image.url} '
                         'style="width:150px; object-fit:cover; aspect-ratio:1/1; border-radius:50%"') \
            if obj.image else '-------'

    def big_image_preview(self, obj):
        return mark_safe(f'<img src={obj.image.url} '
                         'style="width:400px; object-fit:cover; aspect-ratio:1/1; border-radius:50%"') \
            if obj.image else '-------'

    big_image_preview.short_description = image_preview.short_description = 'Картинка'


@admin.register(Allergen)
class AllergenAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'latin_title', 'low', 'middle', 'high', 'very_high')
    list_display_links = list_display


@admin.register(PollenCalendar)
class PollenCalendarAdmin(admin.ModelAdmin):
    list_display_links = list_display = 'id', 'date', 'allergen', 'concentration', 'get_risk_score'
    change_list_template = 'main/admin/advanced_changelist_view.html'
    change_form_template = 'main/admin/advanced_change_view.html'
    fields = 'date', 'allergen', 'concentration', 'get_risk_score'
    readonly_fields = ('get_risk_score', )

    def get_risk_score(self, obj):
        obj: PollenCalendar
        return round(obj.allergen.get_risk_score(obj.concentration), 2)
    get_risk_score.short_description = 'Уровень риска'

    def get_queryset(self, request):
        return PollenCalendar.objects.all().select_related('allergen')

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context['custom_object_tools_items'] = [
            {'title': 'Добавить пыление за день', 'url': '/import-export/import/pollenday/'}
        ]
        return super(PollenCalendarAdmin, self).changelist_view(request, extra_context)

    def change_view(self, request, object_id, form_url="", extra_context=None):
        extra_context = extra_context or {}
        if 'allow_change' not in request.GET:
            extra_context['custom_object_tools_items'] = [
                {'title': 'Разрешить редактирование', 'url': request.build_absolute_uri('?') + '?allow_change=1'}
            ]
        else:
            extra_context['custom_object_tools_items'] = [
                {'title': 'Запретить редактирование', 'url': request.build_absolute_uri('?')}
            ]
        return super(PollenCalendarAdmin, self).change_view(request, object_id, form_url, extra_context)

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        if super(PollenCalendarAdmin, self).has_change_permission(request, obj):
            if 'allow_change' in request.GET:
                return True
        return False
