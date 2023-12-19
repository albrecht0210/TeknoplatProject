from rest_framework import serializers
from ..models import Account

class AccountSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField(source='get_full_name')
    role = serializers.ReadOnlyField(source='get_role')
    is_staff = serializers.ReadOnlyField()
    is_superuser = serializers.ReadOnlyField()
    
    CHOOSE_ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('teacher', 'Teacher'),
        ('student', 'Student'),
    ]
    choose_role = serializers.ChoiceField(choices=CHOOSE_ROLE_CHOICES, write_only=True)

    class Meta:
        model = Account
        fields = (
            'id', 'full_name', 'role', 'is_staff', 'is_superuser',
            'username', 'email', 'first_name', 'last_name', 'avatar', 'password', 'choose_role'
        )
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        choose_role = validated_data.pop('choose_role', None)
        
        user = Account.objects.create_user(**validated_data)

        if choose_role == 'teacher':
            user.is_staff = True
            user.save()
        elif choose_role == 'admin':
            user.is_staff = True
            user.is_superuser = True
            user.save()

        return user
    
    def update(self, instance, validated_data):
        choose_role = validated_data.pop('choose_role', None)

        for attr, value in validated_data.items():
            if attr == 'password' and value:
                instance.set_password(value)
            else:
                setattr(instance, attr, value)

        if choose_role == 'teacher':
            instance.is_staff = True
            instance.is_superuser = False
        elif choose_role == 'admin':
            instance.is_staff = True
            instance.is_superuser = True
        else:
            instance.is_staff = False
            instance.is_superuser = False
        instance.save()

        return instance