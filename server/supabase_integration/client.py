from supabase import create_client, Client
from django.conf import settings
from django.core.cache import cache
from dotenv import load_dotenv
import logging
import os

# Load environment variables from .env file
load_dotenv()

logger = logging.getLogger(__name__)

# Cache key for the Supabase client
SUPABASE_CLIENT_CACHE_KEY = 'supabase_client'
# Cache timeout in seconds (5 minutes)
SUPABASE_CLIENT_CACHE_TIMEOUT = 300

def get_supabase_client():
    """
    Returns a configured Supabase client using settings from Django settings.
    Uses caching to avoid creating a new client for every request.
    
    Returns:
        Client: Configured Supabase client
    
    Raises:
        ValueError: If Supabase URL or key is missing
        Exception: For other errors
    """
    try:
        # Try to get client from cache first
        cached_client = cache.get(SUPABASE_CLIENT_CACHE_KEY)
        if cached_client:
            logger.debug("Using cached Supabase client")
            return cached_client
        
        # Get URL and key from environment variables or settings
        url = os.getenv('SUPABASE_URL') or settings.SUPABASE_URL
        key = os.getenv('SUPABASE_KEY') or settings.SUPABASE_KEY
        
        # Validate URL and key
        if not url or not key:
            logger.error("Supabase URL or key is missing in environment variables and settings")
            raise ValueError("Supabase URL or key is missing")
        
        logger.info(f"Creating new Supabase client with URL: {url}")
        
        # Create client with additional options
        client = create_client(url, key, {
            'auto_refresh_token': True,
            'persist_session': False,
            'detect_session_in_url': False
        })
        
        # Cache the client
        cache.set(SUPABASE_CLIENT_CACHE_KEY, client, SUPABASE_CLIENT_CACHE_TIMEOUT)
        
        return client
    except Exception as e:
        logger.error(f"Error creating Supabase client: {str(e)}")
        raise

def clear_supabase_client_cache():
    """
    Clears the Supabase client from cache.
    Useful when configuration changes.
    """
    cache.delete(SUPABASE_CLIENT_CACHE_KEY)
    logger.info("Supabase client cache cleared")

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