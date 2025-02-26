from allauth.socialaccount.signals import social_account_added
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import UserProfile

@receiver(social_account_added)
def create_user_and_profile(request, sociallogin, **kwargs):
    user = sociallogin.user

    # Extract email from Google login data
    email = sociallogin.account.extra_data.get('email')
    print(email)
    if email:
        user.username = email  # Set email as username
        user.email = email  # Ensure email is also saved properly

    if not user.pk:
        user.save()
    else:
        user.save(update_fields=["username", "email"])  

    # Ensure UserProfile exists
    user_profile, created = UserProfile.objects.get_or_create(user=user)

    # First login logic (set first_login to False after first login)
    if user_profile.first_login:
        user_profile.first_login = False
        user_profile.save()
