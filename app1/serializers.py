# serializers.py
from rest_framework import serializers
from .models import SupportTicket,PurchasedTickets,VenueTicketSummary

class SupportTicketSerializer(serializers.ModelSerializer):
    # If you want to display the user's name and profile picture
    user_name = serializers.CharField(source='user_profile.name', read_only=True)
    profile_picture = serializers.ImageField(source='user_profile.user_profile', allow_null=True, read_only=True)

    class Meta:
        model = SupportTicket
        fields = ['id', 'title', 'description','venue','attachment', 'created_at', 'user_name','priority', 'ticketstatus','reply', 'profile_picture','useremail']



class PurchasedTicketsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchasedTickets
        fields = ['user', 'ticketid', 'ticketname', 'ticketprice', 'ticket_count','purchase_date']

class VenueSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = VenueTicketSummary
        fields = ['id','venue_name','date_time','total_price']       

class TotalPurchasedTicketsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchasedTickets
        fields = ['user', 'ticketid', 'ticketname', 'ticketprice', 'ticket_count','purchase_date' , 'venue']
