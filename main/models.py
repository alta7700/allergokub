from datetime import datetime, timedelta
from django.db import models
from django.db.models.aggregates import Max
from articles.models import Article


def instance_id_upload_path(instance, filename):
    return f'team_images/{instance.position}.{filename.split(".")[-1]}'


class TeamMember(models.Model):
    fio: str = models.CharField(verbose_name='ФИО', max_length=100)
    post: str = models.CharField(verbose_name='Должность', max_length=100)
    short_description: str = models.TextField(verbose_name='Короткое описание')
    show: bool = models.BooleanField(verbose_name='Показывать на сайте', default=True)
    position: int = models.SmallIntegerField(verbose_name='Позиция', unique=True)
    image = models.ImageField(verbose_name='Круг', upload_to=instance_id_upload_path)

    class Meta:
        verbose_name = 'Участник команды'
        verbose_name_plural = 'Участники команды'
        ordering = ['position']

    def __str__(self):
        return self.fio


class Allergen(models.Model):
    POLLEN = 1
    SPORES = 2

    TYPES = (
        (POLLEN, 'Пыльца растений'),
        (SPORES, 'Споры грибов'),
    )

    allergen_type: int = models.PositiveSmallIntegerField(verbose_name='Тип', choices=TYPES)
    title: str = models.CharField(verbose_name='Название', max_length=100, unique=True)
    latin_title: str = models.CharField(verbose_name='Латинское название', max_length=100)
    about: Article = models.OneToOneField(verbose_name='', to=Article, on_delete=models.SET_NULL, null=True,
                                          blank=True, limit_choices_to={'article_type': Article.ALLERGEN},
                                          related_name='allergen')
    low: int = models.PositiveIntegerField(verbose_name='Низкий риск')
    middle: int = models.PositiveIntegerField(verbose_name='Средний риск')
    high: int = models.PositiveIntegerField(verbose_name='Высокий риск')
    very_high: int = models.PositiveIntegerField(verbose_name='Очень высокий риск')
    multiplier: int = models.PositiveSmallIntegerField(verbose_name='Вес (множитель)', default=1)

    class Meta:
        verbose_name = 'Аллерген'
        verbose_name_plural = 'Аллергены'
        ordering = ['title']

    def __str__(self):
        return self.title

    def get_risk_score(self, concentration: float):
        levels = (0, self.low, self.middle, self.high, self.very_high)
        for i, level in enumerate(levels[1:]):
            if concentration < level:
                last_level = levels[i]
                return round(i + ((concentration - last_level) / (level - last_level)), 2)
        return 4


class PollenCalendar(models.Model):
    date: datetime = models.DateField(verbose_name='Дата')
    allergen: Allergen = models.ForeignKey(verbose_name='Аллерген', to=Allergen, on_delete=models.PROTECT,
                                           related_name='calendar')
    concentration: float = models.FloatField(verbose_name='Концентрация')

    class Meta:
        verbose_name = 'Запись о пылении'
        verbose_name_plural = 'Календарь пылений'
        indexes = [
            models.Index(fields=('date', 'allergen')),
            models.Index(fields=('allergen',)),
            models.Index(fields=('date', )),
        ]
        unique_together = ('date', 'allergen')
        ordering = ['-date', 'allergen']

    @classmethod
    def max_date_concentrations(cls, select_related: tuple = None):
        actual_date = cls.objects.aggregate(Max('date'))['date__max']
        queryset = cls.objects.filter(date=actual_date)
        if select_related:
            queryset = queryset.select_related(*select_related)
        return queryset, actual_date

    @classmethod
    def last_allergen_concentration(cls, allergen_id):
        return cls.objects.get(
            allergen__id=allergen_id,
            date=cls.objects.filter(allergen__id=allergen_id).aggregate(Max('date'))['date__max']
        )

    @classmethod
    def last_month_concentration(cls, allergen_id):
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=30)
        return cls.date_range_concentration(allergen_id, start_date, end_date)

    @classmethod
    def date_range_concentration(cls, allergen_id, start_date, end_date):
        pollens = cls.objects.filter(
            allergen__id=allergen_id,
            date__range=(start_date, end_date)
        ).order_by('date')
        return [{'date': x.date.strftime('%Y-%m-%d'), 'value': round(x.concentration, 2)} for x in pollens]
