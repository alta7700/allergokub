python manage.py collectstatic --noinput
gunicorn AllergoKub.wsgi:application -c gunicorn.conf.py