from pathlib import Path

from profiles.settings import *


SETTINGS_DIR = Path(__file__).resolve().parent
BASE_DIR = SETTINGS_DIR.parent

if (SETTINGS_DIR / '.env').exists():
    from dotenv import dotenv_values
    env = dotenv_values(SETTINGS_DIR / '.env')
    DEBUG = False
else:
    from os import environ
    env = {**environ}
    DEBUG = False


INSTALLED_APPS = [
    'main.apps.MainConfig',
    'articles.apps.ArticlesConfig',
    'profiles.apps.ProfilesConfig',

    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'djoser',

    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'corsheaders.middleware.CorsPostCsrfMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'AllergoKub.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            BASE_DIR / 'reactapp/build'
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'AllergoKub.wsgi.application'

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'ru-RU'

TIME_ZONE = 'Europe/Moscow'

USE_I18N = True

USE_TZ = True

STATICFILES_DIRS = [
    BASE_DIR / 'reactapp/build/static',
    BASE_DIR / 'main/static'
]
if not DEBUG:
    STATIC_ROOT = BASE_DIR / 'static'
STATIC_URL = '/static/'
MEDIA_ROOT = BASE_DIR / 'media'
MEDIA_URL = '/media/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}


CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': env['REDIS_CACHE'],
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}
CACHE_TTL = 3600


def list_from_env_value(name: str, required=False):
    value = env.get(name, '')
    assert value if required else True, f'{name} must be in .env file'
    return [item for item in value.split(',') if item]


SECRET_KEY = env['SECRET_KEY']


DEFAULT_FROM_EMAIL = env['DEFAULT_FROM_EMAIL']
EMAIL_HOST = env['EMAIL_HOST']
EMAIL_PORT = env['EMAIL_PORT']
EMAIL_HOST_USER = env['EMAIL_HOST_USER']
EMAIL_HOST_PASSWORD = env['EMAIL_HOST_PASSWORD']
EMAIL_USE_TLS = bool(int(env['EMAIL_USE_TLS']))
EMAIL_USE_SSL = bool(int(env['EMAIL_USE_SSL']))

ALLOWED_HOSTS = list_from_env_value('ALLOWED_HOSTS')
CSRF_TRUSTED_ORIGINS = list_from_env_value('CSRF_TRUSTED_ORIGINS')
CORS_ALLOWED_ORIGINS = list_from_env_value('CORS_ALLOWED_ORIGINS')


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'AllergoKub',
        'USER': env['DB_USER'],
        'PASSWORD': env['DB_PASSWORD'],
        'HOST': env['DB_HOST'],
        'PORT': env['DB_PORT'],
    }
}
