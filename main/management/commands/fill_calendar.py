from django.core.management.base import BaseCommand
from .FillCalendar.fill_calendar import parse_and_fill


class Command(BaseCommand):
    help = 'Заполняем календарь пыления из архива'

    def handle(self, *args, **options):
        parse_and_fill()
