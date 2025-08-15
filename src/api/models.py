from django.db import models


class Token(models.Model):
    id = models.AutoField(primary_key=True)
    token = models.CharField(max_length=255)
    created_at = models.DateTimeField()
    expires_at = models.DateTimeField()
    user_id = models.IntegerField()
    is_used = models.BooleanField(default=False)


class User(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.username
    
class Character(models.Model):
    FACTION_CHOICES = [
        ('The Crusaders', 'The Crusaders'),
        ('The Moors', 'The Moors'),
    ]
    
    RACE_CHOICES = [
        ('Castilian', 'Castilian'),
        ('Aragonese', 'Aragonese'),
        ('Leonese', 'Leonese'),
        ('Andalusian', 'Andalusian'),
        ('Berber', 'Berber'),
        ('Mashriqi', 'Mashriqi'),
    ]
    
    CLASS_CHOICES = [
        ('Knight', 'Knight'),
        ('Arbalist', 'Arbalist'),
        ('Skirmisher', 'Skirmisher'),
        ('Blade Dancer', 'Blade Dancer'),
        ('Alchemist', 'Alchemist'),
        ('Mystic Poet', 'Mystic Poet'),
    ]

    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='characters')
    name = models.CharField(max_length=255, default='Unnamed Hero')
    faction = models.CharField(max_length=50, choices=FACTION_CHOICES)
    race = models.CharField(max_length=50, choices=RACE_CHOICES)
    character_class = models.CharField(max_length=50, choices=CLASS_CHOICES)
    level = models.IntegerField(default=1)
    experience = models.IntegerField(default=0)
    gold = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        # One active character per user
        constraints = [
            models.UniqueConstraint(
                fields=['user'], 
                condition=models.Q(is_active=True),
                name='one_active_character_per_user'
            )
        ]

    def __str__(self) -> str:
        return f"{self.name} ({self.race} {self.character_class})"