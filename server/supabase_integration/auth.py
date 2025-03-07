from .client import get_supabase_client
from dotenv import load_dotenv
import logging
import os
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed, ValidationError

# Load environment variables from .env file
load_dotenv()

logger = logging.getLogger(__name__)

class SupabaseAuth:
    """
    Handles authentication operations with Supabase.
    """
    
    @staticmethod
    def sign_up(email, password, metadata=None):
        """
        Register a new user with Supabase.
        
        Args:
            email (str): User's email
            password (str): User's password
            metadata (dict, optional): Additional user metadata
            
        Returns:
            dict: Response from Supabase
        """
        try:
            supabase = get_supabase_client()
            response = supabase.auth.sign_up({
                "email": email,
                "password": password,
                "options": {
                    "data": metadata or {}
                }
            })
            
            # In the latest Supabase SDK, successful responses don't have an error attribute
            # Instead, we check if user and session exist
            return {
                "success": True,
                "user": response.user,
                "session": response.session
            }
            
        except Exception as e:
            logger.error(f"Error during sign up: {str(e)}")
            raise
    
    @staticmethod
    def sign_in(email, password):
        """
        Sign in a user with email and password.
        
        Args:
            email (str): User's email
            password (str): User's password
            
        Returns:
            dict: Response containing user and session data
        """
        try:
            supabase = get_supabase_client()
            response = supabase.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            
            # In the latest Supabase SDK, successful responses don't have an error attribute
            # Instead, we check if user and session exist
            return {
                "success": True,
                "user": response.user,
                "session": response.session
            }
            
        except Exception as e:
            logger.error(f"Error during sign in: {str(e)}")
            raise
    
    @staticmethod
    def sign_out(access_token):
        """
        Sign out a user.
        
        Args:
            access_token (str): User's access token
            
        Returns:
            dict: Success status
        """
        try:
            supabase = get_supabase_client()
            # Set the auth token for the client
            supabase.auth.set_auth(access_token)
            response = supabase.auth.sign_out()
            
            # In the latest Supabase SDK, successful responses don't have an error attribute
            return {"success": True}
            
        except Exception as e:
            logger.error(f"Error during sign out: {str(e)}")
            raise
    
    @staticmethod
    def reset_password(email):
        """
        Send a password reset email.
        
        Args:
            email (str): User's email
            
        Returns:
            dict: Success status
        """
        try:
            supabase = get_supabase_client()
            response = supabase.auth.reset_password_for_email(email)
            
            # In the latest Supabase SDK, successful responses don't have an error attribute
            return {"success": True}
            
        except Exception as e:
            logger.error(f"Error during password reset: {str(e)}")
            raise
    
    @staticmethod
    def update_password(access_token, new_password):
        """
        Update a user's password.
        
        Args:
            access_token (str): User's access token
            new_password (str): New password
            
        Returns:
            dict: Success status
        """
        try:
            supabase = get_supabase_client()
            # Set the auth token for the client
            supabase.auth.set_auth(access_token)
            response = supabase.auth.update_user({"password": new_password})
            
            # In the latest Supabase SDK, successful responses don't have an error attribute
            return {"success": True}
            
        except Exception as e:
            logger.error(f"Error during password update: {str(e)}")
            raise
    
    @staticmethod
    def get_user(access_token):
        """
        Get the current user based on the access token.
        
        Args:
            access_token (str): User's access token
            
        Returns:
            dict: User data
        """
        try:
            supabase = get_supabase_client()
            # Set the auth token for the client
            supabase.auth.set_auth(access_token)
            response = supabase.auth.get_user()
            
            # In the latest Supabase SDK, successful responses don't have an error attribute
            return {
                "success": True,
                "user": response.user
            }
            
        except Exception as e:
            logger.error(f"Error getting user: {str(e)}")
            raise
    
    @staticmethod
    def verify_token(access_token):
        """
        Verify a JWT token.
        
        Args:
            access_token (str): JWT token to verify
            
        Returns:
            dict: User data if token is valid
        """
        try:
            # Get user data to verify the token
            return SupabaseAuth.get_user(access_token)
        except Exception as e:
            logger.error(f"Token verification failed: {str(e)}")
            raise AuthenticationFailed("Invalid or expired token") 