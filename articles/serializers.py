from rest_framework import serializers
from rest_framework_recursive.fields import RecursiveField
from main.serializers import AllergenItemSerializer
from .models import Article, ArticleBlock, BlockImage
from main.models import Allergen


class ArticlesListSerializer(serializers.ModelSerializer):
    creation_date = serializers.DateTimeField(source='creation_dt', format='%d.%m.%Y', read_only=True)

    class Meta:
        model = Article
        fields = 'id', 'title', 'slug', 'short_description', 'cover', 'creation_date'


class TilesListSerializer(serializers.ModelSerializer):
    update_date = serializers.DateTimeField(source='update_dt', format='%d.%m.%Y', read_only=True)

    class Meta:
        model = Article
        fields = 'id', 'title', 'slug', 'short_description', 'cover', 'update_date'


class AllergensListSerializer(serializers.ModelSerializer):
    current_allergen = AllergenItemSerializer(source='allergen', read_only=True)

    class Meta:
        model = Article
        fields = 'id', 'title', 'slug', 'cover', 'current_allergen'


class BlockImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockImage
        fields = 'id', 'title', 'image'


class StyleSerializer(serializers.Serializer):

    def to_representation(self, instance):
        stylesheet = {}
        for style in instance.split('\n'):
            if style:
                print(style)
                key, value = style.split(':')
                key = key.split('-')
                key = f"{key[0]}{''.join((x.capitalize() for x in key[1:])) if len(key) > 1 else ''}"
                stylesheet[key] = value
        return stylesheet


class ArticleBlockSerializer(serializers.ModelSerializer):
    images = BlockImageSerializer(many=True)
    textStyles = StyleSerializer(source='text_styles')
    nested_blocks = serializers.ListField(source='nested_blocks.all', child=RecursiveField(), read_only=True)

    class Meta:
        model = ArticleBlock
        fields = 'id', 'block_type', 'text', 'textStyles', 'add_hr', 'hidden', 'images', 'horizontal', 'nested_blocks'
        depth = 0


class TileSerializer(serializers.ModelSerializer):
    blocks = ArticleBlockSerializer(many=True)
    update_date = serializers.DateTimeField(format='%d %B, %Y', source='update_dt', read_only=True)

    class Meta:
        model = Article
        fields = 'id', 'title', 'slug', 'short_description', 'cover', 'show_cover', 'update_date', 'blocks'


class ArticleSerializer(serializers.ModelSerializer):
    blocks = ArticleBlockSerializer(many=True)
    creation_date = serializers.DateTimeField(format='%d %B, %Y', source='creation_dt', read_only=True)

    class Meta:
        model = Article
        fields = 'id', 'title', 'slug', 'short_description', 'cover', 'show_cover', 'creation_date', 'blocks'
