from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.shortcuts import resolve_url  # Ensures correct URL resolution
from .models import UserProfile

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def get_login_redirect_url(self, request):
        user = request.user


        # Ensure UserProfile exists
        user_profile, created = UserProfile.objects.get_or_create(user=user)

        # Redirect based on first login status
        if user_profile.first_login:
            user_profile.first_login = False
            user_profile.save()
            return resolve_url('/userdetails')  
        else:
            return resolve_url('/gamepage01')  
