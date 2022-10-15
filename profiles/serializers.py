from rest_framework import serializers
from djoser.serializers import UserCreateSerializer as DjoserUserCreateSerializer
from .models import User
from .validators import EmailUniqueValidator


class CustomUserCreateSerializer(DjoserUserCreateSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[EmailUniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(style={"input_type": "password"}, write_only=True, required=True)
    password2 = serializers.CharField(style={"input_type": "password"}, write_only=True, required=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'password2')

    def validate(self, attrs):
        password2 = attrs.pop('password2')
        attrs = super(CustomUserCreateSerializer, self).validate(attrs)
        if attrs['password'] != password2:
            raise serializers.ValidationError({"password2": "Пароли не совпадают"})
        return attrs


class CustomUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(read_only=True)
    age = serializers.IntegerField(min_value=0, max_value=130)
    date_joined = serializers.DateTimeField(format='%d.%m.%Y', read_only=True)

    class Meta:
        model = User
        fields = 'email', 'first_name', 'last_name', 'age', 'allergens', 'date_joined'
        read_only_fields = ('email', )

    def to_representation(self, instance):
        user_obj = super(CustomUserSerializer, self).to_representation(instance)
        user_obj['allergens'] = [str(x) for x in user_obj['allergens']]
        return user_obj

    def update(self, instance, validated_data):
        print(validated_data)
        return super(CustomUserSerializer, self).update(instance, validated_data)
