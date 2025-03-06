from django.urls import path
from .views import (
    AIProcessView, SupabaseConfigView, 
    SignUpView, SignInView, SignOutView, ResetPasswordView, UserView, SessionView,
    DataView, QueryView, StorageView, PublicUrlView
)

urlpatterns = [
    path('process/', AIProcessView.as_view(), name='ai-process'),
    
    # Supabase Configuration
    path('supabase/config/', SupabaseConfigView.as_view(), name='supabase-config'),
    
    # Authentication endpoints
    path('auth/signup/', SignUpView.as_view(), name='auth-signup'),
    path('auth/signin/', SignInView.as_view(), name='auth-signin'),
    path('auth/signout/', SignOutView.as_view(), name='auth-signout'),
    path('auth/reset-password/', ResetPasswordView.as_view(), name='auth-reset-password'),
    path('auth/user/', UserView.as_view(), name='auth-user'),
    path('auth/session/', SessionView.as_view(), name='auth-session'),
    
    # Data endpoints
    path('data/', DataView.as_view(), name='data'),
    path('data/query/', QueryView.as_view(), name='data-query'),
    
    # Storage endpoints
    path('storage/', StorageView.as_view(), name='storage'),
    path('storage/public-url/', PublicUrlView.as_view(), name='storage-public-url'),
] 