from django.core.management.base import BaseCommand
from .FillModel.fill_model import fill
from main.models import Allergen
from pathlib import Path


class Command(BaseCommand):
    help = 'Заполняем аллергены из таблицы'

    def handle(self, *args, **options):
        file = Path(__file__).parent / 'FillModel/Аллергены.xlsx'
        fill(file=file, model=Allergen, sort_field='title')
