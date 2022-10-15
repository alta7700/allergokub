# Generated by Django 4.0.3 on 2022-04-04 13:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0004_alter_user_allergies'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='age',
            field=models.PositiveSmallIntegerField(blank=True, null=True, verbose_name='Возраст'),
        ),
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(max_length=254, unique=True, verbose_name='Email адрес'),
        ),
    ]
