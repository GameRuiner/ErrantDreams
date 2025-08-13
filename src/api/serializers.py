from rest_framework import serializers
from .models import User, Token, Character


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "password"]


class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ["token", "created_at", "expires_at", "user_id", "is_used"]

class CharacterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Character
        fields = ['id', 'user', 'name', 'faction', 'race', 'character_class', 
                 'level', 'experience', 'gold', 'created_at', 'is_active']
        read_only_fields = ['id', 'created_at', 'level', 'experience', 'gold']

    def validate(self, data):
        race_class_compatibility = {
            'Castilian': ['Knight', 'Arbalist'],
            'Aragonese': ['Knight', 'Arbalist', 'Skirmisher', 'Alchemist'],
            'Leonese': ['Knight', 'Arbalist', 'Mystic Poet'],
            'Andalusian': ['Skirmisher', 'Blade Dancer', 'Alchemist', 'Mystic Poet'],
            'Berber': ['Arbalist', 'Skirmisher', 'Blade Dancer'],
            'Mashriqi': ['Blade Dancer', 'Alchemist', 'Mystic Poet']
        }
        
        race = data.get('race')
        character_class = data.get('character_class')
        
        if race and character_class:
            allowed_classes = race_class_compatibility.get(race, [])
            if character_class not in allowed_classes:
                raise serializers.ValidationError(
                    f"{race} cannot be a {character_class}. "
                    f"Available classes: {', '.join(allowed_classes)}"
                )
        
        return data