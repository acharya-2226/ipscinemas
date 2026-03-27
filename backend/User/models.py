from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """
    Custom User model with role-based access control.
    
    ROLES:
    - owner: Cinema owner/admin - Can create/edit/delete movies
    - staff: Manager/Employee - Can create/edit/delete shows and seats
    - user: Regular customer - Can only view movies and book seats
    """
    ROLE_OWNER = "owner"
    ROLE_STAFF = "staff"
    ROLE_USER = "user"

    ROLE_CHOICES = [
        (ROLE_OWNER, "Owner"),
        (ROLE_STAFF, "Manager/Employee"),
        (ROLE_USER, "User"),
    ]

    is_admin = models.BooleanField(default=False)
    role = models.CharField(max_length=16, choices=ROLE_CHOICES, default=ROLE_USER)

    def is_owner(self):
        """Check if user is owner"""
        return self.is_superuser or self.role == self.ROLE_OWNER

    def is_staff_role(self):
        """Check if user is staff (owner or staff role)"""
        return self.is_superuser or self.role in {self.ROLE_OWNER, self.ROLE_STAFF}

    def is_user_role(self):
        """Check if user is regular user"""
        return self.is_superuser or self.role == self.ROLE_USER

    def __str__(self):
        return self.username
