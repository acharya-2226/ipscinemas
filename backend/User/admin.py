from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('role', 'is_admin')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Custom Fields', {'fields': ('role', 'is_admin')}),
    )
    list_display = ('username', 'email', 'role', 'is_admin', 'is_staff', 'is_superuser', 'last_login')
    list_filter = UserAdmin.list_filter + ('role',)
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    readonly_fields = ('last_login', 'date_joined')
    actions = ('promote_to_staff', 'demote_to_user')

    @admin.action(description='Promote selected users to staff role')
    def promote_to_staff(self, request, queryset):
        updated = queryset.update(role=User.ROLE_STAFF)
        self.message_user(request, f'{updated} user(s) promoted to staff role.')

    @admin.action(description='Set selected users to regular user role')
    def demote_to_user(self, request, queryset):
        updated = queryset.update(role=User.ROLE_USER)
        self.message_user(request, f'{updated} user(s) set to user role.')

