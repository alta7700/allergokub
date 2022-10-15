# Generated by Django 4.0.3 on 2022-04-21 14:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('articles', '0003_alter_article_article_type_and_more'),
        ('main', '0007_alter_pollencalendar_options_remove_allergen_unit'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='allergen',
            name='description',
        ),
        migrations.AddField(
            model_name='allergen',
            name='about',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='articles.article', verbose_name=''),
        ),
        migrations.AlterField(
            model_name='pollencalendar',
            name='allergen',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='calendar', to='main.allergen', verbose_name='Аллерген'),
        ),
    ]
