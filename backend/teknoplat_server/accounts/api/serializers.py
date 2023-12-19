from rest_framework import serializers

from ..models import Account

class AccountSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField(source='get_full_name')
    role = serializers.ReadOnlyField(source='get_role')

    CHOOSE_ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('teacher', 'Teacher'),
        ('student', 'Student'),
    ]
    choose_role = serializers.ChoiceField(choices=CHOOSE_ROLE_CHOICES, write_only=True)

    class Meta:
        model = Account
        fields = ('id', 'full_name', 'username', 'email', 'first_name', 'last_name', 'role', 'choose_role')

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
