from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager
from main.models import Allergen
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.validators import UnicodeUsernameValidator


class CustomUserManager(UserManager):

    def create_user(self, username=None, email=None, password=None, **extra_fields):
        username = get_username_by_email(email)
        return super(CustomUserManager, self).create_user(username, email, password, **extra_fields)

    def create_superuser(self, username=None, email=None, password=None, **extra_fields):
        username = get_username_by_email(email)
        return super(CustomUserManager, self).create_superuser(username, email, password, **extra_fields)


class User(AbstractUser):

    username_validator = UnicodeUsernameValidator()
    username = models.CharField(
        verbose_name=_("username"),
        max_length=150,
        help_text=_("Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only."),
        validators=[username_validator],
        default=''
    )

    allergens: Allergen = models.ManyToManyField(verbose_name='Аллергии', to=Allergen, related_name='users', blank=True)
    email = models.EmailField(verbose_name='Email адрес', unique=True)
    age = models.PositiveSmallIntegerField(verbose_name='Возраст', null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []


def get_username_by_email(email):
    try:
        return email.split('@')[0]
    except:
        return ''
