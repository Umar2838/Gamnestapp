
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import datetime
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=10 , null=True, blank=True)
    user_profile = models.ImageField(upload_to='avatars/', null=True, blank=True)
    dob = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=(('Male', 'Male'), ('Female', 'Female')), null=True, blank=True)
    forgetPasswordToken = models.CharField(max_length=100 , null=True)
    selected_location = models.CharField(max_length=255, blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    def __str__(self):
        return self.user.username 

class SupportTicket(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    useremail = models.EmailField(max_length=255 , null=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    attachment = models.FileField(upload_to='tickets/attachments/', null=True, blank=True)
    priority = models.CharField(max_length=10, choices=[('high', 'High'), ('medium', 'Medium'), ('low', 'Low')],null=True, blank=True)
    ticketstatus = models.CharField(max_length=20, choices=[('on-going', 'On Going'), ('resolved', 'Resolved')],null=True, blank=True)
    reply = models.TextField(max_length=255,null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title


class PurchasedTickets(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    ticketid = models.IntegerField(null=True, blank=True)
    ticketname = models.CharField(max_length=255,null=True,blank=True)
    ticketprice = models.IntegerField(null=True,blank=True) 
    ticket_count = models.IntegerField(default=1)  
    purchase_date = models.DateField(default=datetime.date.today) 

    def __str__(self):
        return self.ticketname

class TotalPurchasedTickets(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    ticketid = models.IntegerField(null=True, blank=True)
    ticketname = models.CharField(max_length=255,null=True,blank=True)
    ticketprice = models.IntegerField(null=True,blank=True) 
    ticket_count = models.IntegerField(default=1)  
    purchase_date = models.DateField(default=datetime.date.today) 

    def __str__(self):
        return self.ticketname
    

class VenueTicketSummary(models.Model):
    venue_name = models.CharField(max_length=255,null=True)
    total_price = models.IntegerField(null=True,blank=True)
    date_time = models.DateTimeField(auto_now_add=True)  

    def __str__(self):
        return f"{self.venue_name} - {self.total_price}"        