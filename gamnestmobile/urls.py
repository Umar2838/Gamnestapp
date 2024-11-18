from django.contrib import admin
from django.urls import path ,include
from app1 import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/',include('allauth.urls')),
    path('api/purchased-tickets/', views.PurchasedTicketsList.as_view(), name='purchased-tickets-list'),
    path('', views.index, name="index"),
    path('signup', views.signup, name="signup"),
    path('signupemail', views.signupemail, name="signupemail"),
    path('loginshow', views.loginshow, name="loginshow"),
    path('loginemail', views.loginemail, name="loginemail"),
    path('forgetPassword', views.forgetPassword, name="forgetpassword"),
    path('emailverifymessage', views.emailverifymessage, name="emailverifymessage"),
    path('resetPassword/<str:user>/', views.resetPassword, name="resetpassword"),
    path('userdetails', views.userdetails, name="userdetails"),
    path('gamepage01', views.gamepage01, name="gamepage01"),
    path('submitTicket',views.supportTicket,name="supportTicket"),
    path('api/tickets/', views.TicketListView.as_view(), name='ticket-list'),
    path('api/allpurchasedtickets/', views.TotalPurchaseTicketList.as_view(), name='allpurchasedtickets-list'),
    path('api/tickets/update/', views.update_ticket, name='update_ticket'),
    path('api/venuesummary/', views.VenueListView.as_view(), name='venue-summary'),
    path('notification', views.notification, name="notification"),
    path('seeAllgames', views.seeAllgames, name="seeAllgames"),
    path('paymentMethod', views.paymentMethod, name="paymentMethod"),
    path('paymentconfirmation', views.paymentconfirmation, name="paymentconfirmation"),
    path('successfulpayment', views.successfulpayment, name="successfulpayment"),
    path('editprofile', views.editProfile, name="editprofile"),
    path('language', views.language, name="language"),
    path('location', views.location, name="location"),
    path('setting', views.setting, name="setting"),
    path('rulesAndpolicies',views.rulesAndPolicy, name="rulesAndPolicy"),
    path('health-check/', include('health_check.urls')),  # Default health-check URL

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

