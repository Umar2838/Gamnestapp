from django import forms
from django.contrib.auth.models import User
import re
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError





# class LoginForm(forms.Form):
#     username = forms.CharField(
#         label='Username',
#         required=True,
#         widget=forms.TextInput(attrs={
#             'class': 'form-control',
#             'placeholder': 'Enter your username',
#         }),
#         error_messages={'required': 'Invalid username or passowrd!'}

#     )
#     password = forms.CharField(
#         label='Password',
#         required=True,
#         widget=forms.PasswordInput(attrs={
#             'class': 'form-control',
#             'placeholder': 'Enter your password',
#         }),
#         error_messages={'required': 'Invalid username or passowrd!'}

#     )
#     remember_me = forms.BooleanField(
#         required=True,
#         widget=forms.CheckboxInput(attrs={
#             'class': 'form-check-input accent-yellow-300',
#         }),
#         error_messages={'required': 'You must check the Remember Me checkbox to continue.'}
#     )

#     def clean(self):
#         cleaned_data = super().clean()
#         username = cleaned_data.get('username')
#         password = cleaned_data.get('password')

#         # Authenticate user using the username and password
#         if username and password:
#             user = authenticate(username=username, password=password)
#             if not user:
#                 errormessage = "Invalid username or password" # Raise error if authentication fails
#         return cleaned_data





class UserRegistrationForm(forms.ModelForm):
    password = forms.CharField(min_length=8)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        labels = {
            'username': 'Name',
            'email': 'Email',
        }

    
    
    def clean_username(self):
        username = self.cleaned_data.get('username')
        if User.objects.filter(username=username).exists():
             raise forms.ValidationError("Username already exists")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", username):
            raise forms.ValidationError("Username must contain at least one special character.")
        return username   

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("Email already exists.")
        
        return email

    def clean_password(self):
        password = self.cleaned_data.get('password')
        
        # Check password length
        if len(password) < 8:
            raise forms.ValidationError("Password must be at least 8 characters long.")

        # Check for at least one special character, one uppercase letter, and one digit
        if not re.search(r"[A-Z]", password):
            raise forms.ValidationError("Password must contain at least one uppercase letter.")
        if not re.search(r"[0-9]", password):
            raise forms.ValidationError("Password must contain at least one number.")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
            raise forms.ValidationError("Password must contain at least one special character.")
        
        return password
    