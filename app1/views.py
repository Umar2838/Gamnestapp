from django.shortcuts import render,redirect,HttpResponse
from django.contrib.auth.models import User
from django.contrib import messages
from app1.form import UserRegistrationForm
from django.contrib.auth.models import User
from django.utils.translation import gettext as _
import re
from django.contrib.auth import authenticate,login
from django.contrib.auth.decorators import login_required
from .models import UserProfile,SupportTicket,PurchasedTickets,VenueTicketSummary,TotalPurchasedTickets
from django.db.models import Sum
from django.http import JsonResponse
import json
from django.urls import reverse
from rest_framework import generics
from .serializers import SupportTicketSerializer,PurchasedTicketsSerializer,VenueSummarySerializer,TotalPurchasedTicketsSerializer
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from .services import get_venue_name
from rest_framework import status
from datetime import datetime, timedelta
from django.utils import timezone
from django.core.mail import send_mail
from gamnestmobile.settings import EMAIL_HOST_USER


def index(request):
    return render(request,'index.html')
def signup(request):
    return render(request,'signup.html')
def signupemail(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            useremail = form.cleaned_data['email']
            userpassword = form.cleaned_data['password']
            user = User.objects.create_user(username, useremail, userpassword)
            user.save()
            return redirect('loginemail')  # Redirect to login page after successful signup
        else:
            # Return form errors as JSON response
            errors = []
            for error in form.errors.values():
                errors.append(error[0])
            
    else:
        form = UserRegistrationForm()
    
    return render(request, 'signupemail.html', {'form': form})


def loginshow(request):
    return render(request,'loginshow.html')


from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib import messages  # for displaying error messages

def loginemail(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        if not username or not password:
            return JsonResponse({'success': False, 'message': 'Both username and password are required.'})
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            # Log in the user
            login(request, user)
            
            # Get the associated user profile
            user_profile = UserProfile.objects.get(user=user)
            
            if user_profile.first_login:
                # Redirect to userdetails if first login
                user_profile.first_login = False  # Update the field
                user_profile.save()  # Save the change to the database
                return JsonResponse({'success': True, 'redirect_url': '/userdetails'})
            else:
                # Redirect to gamepage01 for subsequent logins
                return JsonResponse({'success': True, 'redirect_url': '/gamepage01'})
        else:
            return JsonResponse({'success': False, 'message': 'Invalid username or password.'})
    
    return render(request, 'login.html')


   

def forgetPassword(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            print("User exists")

            # Save the reset request timestamp in a dictionary or session variable
            request.session['reset_timestamp'] = datetime.now().timestamp()

            # Generate reset link with the timestamp as a query parameter
            reset_link = f"https://gamenest.se/resetPassword/{user.username}/?timestamp={request.session['reset_timestamp']}"
            send_mail(
                "Gamnest Reset Password Link",
                f"Hey {user}, to reset your password please click on the following link:\n{reset_link}",
                EMAIL_HOST_USER,
                [email],
                fail_silently=True
            )

            print("email", email)
            redirect_url = reverse('emailverifymessage') + f"?email={email}"
            return redirect(redirect_url)
        else:
            print("User does not exist")    

    return render(request, 'forgetPassword.html')

def emailverifymessage(request):
    email = request.GET.get('email')

    return render(request, 'emailverifymessage.html', {'email': email})
from django.utils import timezone
from datetime import datetime, timedelta

from django.utils import timezone
from datetime import datetime, timedelta, timezone as dt_timezone

def resetPassword(request, user):
    error = ""
    userId = User.objects.get(username=user)

    # Retrieve the timestamp from the URL and check expiration
    timestamp = request.GET.get('timestamp')
    if timestamp:
        # Convert timestamp to a timezone-aware datetime object using datetime.timezone.utc
        reset_time = datetime.fromtimestamp(float(timestamp), tz=dt_timezone.utc)
        current_time = timezone.now()  # This is timezone-aware in Django
        
        # Check if the reset link has expired (5 minutes)
        if current_time > reset_time + timedelta(minutes=5):
            error = "The reset link has expired. Please request a new link."
            return render(request, 'resetpassword.html', {'error': error})

    if request.method == 'POST':
        newpass = request.POST.get('newpass')
        confirmpass = request.POST.get('confirmpass')

        # Validate the password strength and confirmation
        if len(newpass) < 8:
            error = "Password must be at least 8 characters long."
        elif not re.search(r"[A-Z]", newpass):
            error = "Password must contain at least one uppercase letter."
        elif not re.search(r"[0-9]", newpass):
            error = "Password must contain at least one number."
        elif not re.search(r"[!@#$%^&*(),.?\":{}|<>]", newpass):
            error = "Password must contain at least one special character."
        elif newpass != confirmpass:
            error = "Passwords do not match."
        else:
            # Set the new password if validation is successful
            userId.set_password(newpass)
            userId.save()
            return redirect('loginshow')

    return render(request, 'resetpassword.html', {'error': error})



from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import UserProfile
import json

def userdetails(request):
    if request.method == 'POST':
        # Ensure the user is authenticated
            data = json.loads(request.body)
            user = request.user
            name = data.get('name')
            gender = data.get('gender')

            # Get or create the UserProfile
            userdetails, created = UserProfile.objects.get_or_create(user=user)

            # Update the userprofile fields if data is provided
            if name:
                userdetails.name = name
            if gender:
                userdetails.gender = gender

            userdetails.save()

            # Return a success response
            return JsonResponse({'status': 'success'})


    return render(request, 'userdetails.html')

def gamepage01(request):
    user = request.user
    print(user)
    try:
        user_profile = UserProfile.objects.get(user=user)
        name = UserProfile.objects.get(user=user) 
        response = requests.get('https://dashboard.gamenest.se/api/getTickets/')
        tickets = response.json()
        purchasedTicket = PurchasedTickets.objects.filter(user=user)
        total_count = PurchasedTickets.objects.filter(user=user).aggregate(total=Sum('ticket_count'))['total']


    except UserProfile.DoesNotExist:
        user_profile = None

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            ticketpurchaseid = data.get("ticketpurchaseid")
            userid = data.get("userid")
            venue_name = data.get("venueName")  # Get venue name from request data
            ticket_price = float(data.get("ticketprice"))  # Get ticket price from request data

            # Fetch the specific purchased ticket
            purchased_ticket = PurchasedTickets.objects.get(id=ticketpurchaseid, user_id=userid)

            # Check the ticket count
            if purchased_ticket.ticket_count > 1:
                # Decrement the count
                purchased_ticket.ticket_count -= 1
                purchased_ticket.save()
            else:
                # Delete the ticket entry if the count is 1
                purchased_ticket.delete()

            # Add or update the VenueTicketSummary entry
            venue_summary, created = VenueTicketSummary.objects.get_or_create(
                venue_name=venue_name,
                defaults={"total_price": ticket_price, "date_time": datetime.now()},
            )
            if not created:
                # If the entry already exists, add the ticket price to total_price
                venue_summary.total_price += ticket_price
                venue_summary.date_time = datetime.now()
                venue_summary.save()

            return JsonResponse({"success": True, "message": "Ticket updated or removed successfully"})
        except PurchasedTickets.DoesNotExist:
            return JsonResponse({"success": False, "message": "Ticket not found"})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)})

    return render(request,'gamepage01.html',{
        'user': user,
        'user_profile': user_profile,
        'name':name,
        'tickets':tickets,
        'purchasedTicket':purchasedTicket,
        'totalcount':total_count
    })



def supportTicket(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            user = request.user
            email = user.email
        try:
            # Use request.POST for text fields and request.FILES for files
            title = request.POST.get('title')
            description = request.POST.get('description')
            attachments = request.FILES.get('attachment')

            if not title or not description or not attachments:
                return JsonResponse({'error': "Ticket title, description, and attachment are required."}, status=400)

            submitTicket = SupportTicket(
                user_profile= request.user.userprofile,
                useremail = email,
                title=title,
                description=description,
                attachment=attachments  
            )         
            submitTicket.save()
            # send_mail(
            #     "Gamnest Support Ticket",
            #     f"Hey {user}, your request has been recieved by us: \n Title: {title} \n Description:{description} \n Attachments: {attachments} Your ticket status is Pending",
            #     EMAIL_HOST_USER,
            #     [email],
            #     fail_silently=True
            # )
            return JsonResponse({'status': 'success', 'message': 'Ticket submitted successfully.'})
           
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
        
class TicketListView(generics.ListAPIView):
    queryset = SupportTicket.objects.all()
    serializer_class = SupportTicketSerializer

class VenueListView(generics.ListAPIView):
    queryset = VenueTicketSummary.objects.all()
    serializer_class = VenueSummarySerializer

@api_view(['POST'])
def update_ticket(request):
    ticket_id = request.data.get('id')
    ticketstatus = request.data.get('ticketstatus')
    priority = request.data.get('priority')
    reply = request.data.get('reply')
    try:
        supportTicket = get_object_or_404(SupportTicket,id=ticket_id)
        supportTicket.ticketstatus = ticketstatus
        supportTicket.priority = priority
        supportTicket.reply = reply

        supportTicket.save()
        
        return Response({"success": "Ticket found"}, status=status.HTTP_200_OK)
        
    except SupportTicket.DoesNotExist:
        return Response({"error": "Ticket not found"}, status=status.HTTP_404_NOT_FOUND)


class PurchasedTicketsList(generics.ListAPIView):
    queryset = PurchasedTickets.objects.all()
    serializer_class = PurchasedTicketsSerializer

class TotalPurchaseTicketList(generics.ListAPIView):
    queryset = TotalPurchasedTickets.objects.all()    
    serializer_class = TotalPurchasedTicketsSerializer


def notification(request):
    return render(request,'notification.html')
def seeAllgames(request):
    return render(request,'seeAllgames.html')
def paymentMethod(request):
    return render(request,'paymentMethod.html')

def paymentconfirmation(request):
    if request.method == 'POST':
        # Parse the data from the frontend (ticket info sent via fetch request)
        ticket_data = json.loads(request.body)
        ticket_id = ticket_data.get('id')
        ticket_name = ticket_data.get('name')
        ticket_price = ticket_data.get('price')
    
        total_purchased_ticket, created = TotalPurchasedTickets.objects.get_or_create(
            user=request.user,
            ticketid=ticket_id,
            defaults={
                'ticketname': ticket_name,
                'ticketprice':ticket_price
            }
        )

        if not created:
            total_purchased_ticket.ticket_count += 1
            total_purchased_ticket.save()


        # Check if the user already has this ticket in their purchases
        purchased_ticket, created = PurchasedTickets.objects.get_or_create(
            user=request.user,
            ticketid=ticket_id,
            defaults={
                'ticketname': ticket_name,
                'ticketprice':ticket_price
            }
        )

        if not created:
            purchased_ticket.ticket_count += 1
            purchased_ticket.save()

        return JsonResponse({'message': 'Total Ticket purchase recorded successfully'}, status=200)

    return render(request, 'paymentconfirmation.html')

def successfulpayment(request):
    return render(request,'successfulpayment.html') 
from django.contrib import messages
from django.contrib.auth import update_session_auth_hash
from django.core.exceptions import ValidationError
from django.shortcuts import render, redirect
from django.contrib.auth.password_validation import validate_password
from django.http import HttpResponse
from .models import UserProfile
def editProfile(request):
    user = request.user
    try:
        user_profile = UserProfile.objects.get(user=user)
        errormessage = ""
        successmessage = "Profile is up-to-date."
        if request.method == 'POST':
            # Collect data from form
            fileInput = request.FILES.get('fileInput')
            fname = request.POST.get('fname')
            username = request.POST.get('username')
            email = request.POST.get('email')
            date = request.POST.get('date')
            currentPassword = request.POST.get('currentPassword')
            newPassword = request.POST.get('newPassword')
            confirmPassword = request.POST.get('confirmPassword')

            # Update user fields
            
            if username:
                user.username = username
            if email:
                user.email = email
            user.save()

            # Update UserProfile fields
            if fname:
                user_profile.name = fname
            if date:
                user_profile.dob = date
            if fileInput:
                user_profile.user_profile = fileInput
            user_profile.save()

            # Password change logic
            if currentPassword or newPassword or confirmPassword:
                # Step 1: Check if the current password is correct
                if not user.check_password(currentPassword):
                    errormessage = 'Current password is incorrect.'
                else:
                    # Step 2: Check if the new password matches confirm password
                    if newPassword != confirmPassword:
                        errormessage = 'New password and confirm password do not match.'
                    else:
                        # Step 3: Validate the new password
                        try:
                            validate_password(newPassword, user=user)
                            # Step 4: Update the user's password
                            user.set_password(newPassword)
                            user.save()
                            successmessage = "Password change successfully!"
                            return redirect('loginemail')  # Redirect to login page after changing password
                        except ValidationError as e:
                            errormessage = e.messages[0]  # Get the first error message

            # If there was an error, render the form again with the error message
            return render(request, 'editprofile.html', {
                'username': user.username,
                'email': user.email,
                'user_profile': user_profile,
                'name': user_profile.name,
                'dob': user_profile.dob,
                'errormessage': errormessage,
                'successmessage':successmessage
            })

        # Render the profile edit page if GET request
        return render(request, 'editprofile.html', {
            'username': user.username,
            'email': user.email,
            'user_profile': user_profile,
            'name': user_profile.name,
            'dob': user_profile.dob,
            'errormessage': errormessage
        })

    except UserProfile.DoesNotExist:
        return HttpResponse("Profile not found", status=404)




def language(request):
    return render(request,'language.html')
def location(request):
    venues = get_venue_name()  # Get venue names
    print(venues)
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            location = data.get('location')
            latitude = data.get('latitude', None)
            longitude = data.get('longitude', None)

            user_profile = UserProfile.objects.get(user=request.user)

            if location == 'current':
                user_profile.latitude = latitude
                user_profile.longitude = longitude
            else:
                user_profile.selected_location = location
                user_profile.latitude = None  # Clear any previous coordinates
                user_profile.longitude = None

            user_profile.save()

            return JsonResponse({'status': 'success', 'message': 'Location saved successfully'})
        except Exception as e:
            print(e)
            return JsonResponse({'status': 'error', 'message': 'An error occurred'})

    return render(request, 'location.html', {'venues': venues})  # Return correct context variable
def setting(request):
    return render(request,'setting.html')

def rulesAndPolicy(request):

    return render(request,'rulesAndPolicy.html')