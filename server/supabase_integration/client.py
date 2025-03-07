from supabase import create_client, Client
from django.conf import settings
from dotenv import load_dotenv
import logging
import os

# Load environment variables from .env file
load_dotenv()

logger = logging.getLogger(__name__)

# Module-level singleton for the Supabase client
_supabase_client = None

def get_supabase_client():
    """
    Returns a configured Supabase client using settings from Django settings.
    Uses a module-level singleton to avoid creating a new client for every request.
    
    Returns:
        Client: Configured Supabase client
    
    Raises:
        ValueError: If Supabase URL or key is missing
        Exception: For other errors
    """
    global _supabase_client
    
    try:
        # Return existing client if available
        if _supabase_client is not None:
            return _supabase_client
        
        # Get URL and key from environment variables or settings
        url = os.getenv('SUPABASE_URL') or settings.SUPABASE_URL
        key = os.getenv('SUPABASE_KEY') or settings.SUPABASE_KEY
        
        # Validate URL and key
        if not url or not key:
            logger.error("Supabase URL or key is missing in environment variables and settings")
            raise ValueError("Supabase URL or key is missing")
        
        logger.info(f"Creating new Supabase client with URL: {url}")
        
        # Create client - removed options parameter for compatibility with supabase 2.13.0
        _supabase_client = create_client(url, key)
        
        return _supabase_client
    except Exception as e:
        logger.error(f"Error creating Supabase client: {str(e)}")
        raise

def clear_supabase_client():
    """
    Clears the Supabase client singleton.
    Useful when configuration changes.
    """
    global _supabase_client
    _supabase_client = None
    logger.info("Supabase client singleton cleared")

def get_supabase_url():
    """
    Returns the Supabase URL from environment variables or settings.
    
    Returns:
        str: Supabase URL
    """
    return os.getenv('SUPABASE_URL') or settings.SUPABASE_URL

def get_supabase_anon_key():
    """
    Returns the Supabase anon key from environment variables or settings.
    
    Returns:
        str: Supabase anon key
    """
    return os.getenv('SUPABASE_KEY') or settings.SUPABASE_KEY 