# urls.py
from django.urls import path
from .views import *

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/',user_login, name='login'),
    path('profile/', get_profile, name='get_profile'),
    path('profile/update/', update_profile, name='update_profile'),
    # other URL patterns
]



