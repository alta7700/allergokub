# Generated by Django 4.0.3 on 2022-04-21 00:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0008_alter_user_managers'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='allergies',
            new_name='allergens',
        ),
    ]
