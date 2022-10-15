from rest_framework import serializers
from .models import TeamMember, Allergen, PollenCalendar


class TeamMembersListSerializer(serializers.ModelSerializer):

    class Meta:
        model = TeamMember
        fields = 'fio', 'post', 'short_description', 'position', 'image'


class AllergensSerializer(serializers.ModelSerializer):

    class Meta:
        model = Allergen
        fields = 'allergen_type', 'title'

    def to_representation(self, instance):
        obj_dict = super(AllergensSerializer, self).to_representation(instance)
        last = PollenCalendar.last_allergen_concentration(instance.id)
        last: PollenCalendar
        obj_dict['concentration'] = {
            'absolute': last.concentration,
            'score': round(instance.get_risk_score(last.concentration), 2),
            'date': last.date.strftime('%d.%m.%Y'),
        }
        if instance.about:
            obj_dict['slug'] = instance.about.slug
        return {'id': instance.id, 'obj': obj_dict}


class AllergenItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Allergen
        fields = 'id', 'allergen_type', 'title', 'latin_title', 'low', 'middle', 'high', 'very_high'

    def to_representation(self, instance):
        obj = super(AllergenItemSerializer, self).to_representation(instance)
        last = PollenCalendar.last_allergen_concentration(instance.id)
        last: PollenCalendar
        obj['concentration'] = {
            'absolute': last.concentration,
            'score': round(instance.get_risk_score(last.concentration), 2) * 100 / 4,
            'date': last.date.strftime('%d.%m.%Y'),
        }
        obj['month_concentration'] = PollenCalendar.last_month_concentration(instance.id)
        return obj
