# Generated by Django 4.0.3 on 2022-04-03 23:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_alter_allergen_options'),
        ('profiles', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='allergies',
            field=models.ManyToManyField(related_name='users', to='main.allergen', verbose_name='Аллергии'),
        ),
    ]
