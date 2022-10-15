from rest_framework.validators import UniqueValidator


class EmailUniqueValidator(UniqueValidator):
    message = 'Пользователь с таким email уже существует'
