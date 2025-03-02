from supabase import create_client, Client
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def get_supabase_client():
    """
    Returns a configured Supabase client using settings from Django settings.
    """
    try:
        url = settings.SUPABASE_URL
        key = settings.SUPABASE_KEY
        
        if not url or not key:
            logger.error("Supabase URL or key is missing in settings")
            raise ValueError("Supabase URL or key is missing")
            
        return create_client(url, key)
    except Exception as e:
        logger.error(f"Error creating Supabase client: {str(e)}")
        raise 