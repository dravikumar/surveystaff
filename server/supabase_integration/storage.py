from .client import get_supabase_client
from dotenv import load_dotenv
import logging
import os
import uuid
from rest_framework.exceptions import ValidationError

# Load environment variables from .env file
load_dotenv()

logger = logging.getLogger(__name__)

class SupabaseStorage:
    """
    Handles storage operations with Supabase.
    """
    
    @staticmethod
    def upload_file(bucket_name, file_path, file_data, content_type=None, access_token=None):
        """
        Upload a file to Supabase Storage.
        
        Args:
            bucket_name (str): Name of the storage bucket
            file_path (str): Path where the file will be stored
            file_data (bytes): File data to upload
            content_type (str, optional): Content type of the file
            access_token (str, optional): User's access token for RLS
            
        Returns:
            dict: Upload result
        """
        try:
            supabase = get_supabase_client()
            
            # Set auth token if provided (for RLS)
            if access_token:
                supabase.auth.set_auth(access_token)
            
            # Generate a unique filename if not provided
            if not file_path:
                file_extension = os.path.splitext(getattr(file_data, 'name', ''))[1] or ''
                file_path = f"{uuid.uuid4()}{file_extension}"
            
            response = supabase.storage.from_(bucket_name).upload(
                file_path,
                file_data,
                {"content-type": content_type} if content_type else None
            )
            
            if response.error:
                logger.error(f"Supabase storage upload error: {response.error}")
                raise ValidationError(response.error.message)
            
            # Get the public URL
            public_url = supabase.storage.from_(bucket_name).get_public_url(file_path)
            
            return {
                "success": True,
                "path": file_path,
                "public_url": public_url
            }
            
        except Exception as e:
            logger.error(f"Error uploading file: {str(e)}")
            raise
    
    @staticmethod
    def download_file(bucket_name, file_path, access_token=None):
        """
        Download a file from Supabase Storage.
        
        Args:
            bucket_name (str): Name of the storage bucket
            file_path (str): Path of the file to download
            access_token (str, optional): User's access token for RLS
            
        Returns:
            bytes: File data
        """
        try:
            supabase = get_supabase_client()
            
            # Set auth token if provided (for RLS)
            if access_token:
                supabase.auth.set_auth(access_token)
            
            response = supabase.storage.from_(bucket_name).download(file_path)
            
            if response.error:
                logger.error(f"Supabase storage download error: {response.error}")
                raise ValidationError(response.error.message)
            
            return {
                "success": True,
                "data": response
            }
            
        except Exception as e:
            logger.error(f"Error downloading file: {str(e)}")
            raise
    
    @staticmethod
    def delete_file(bucket_name, file_path, access_token=None):
        """
        Delete a file from Supabase Storage.
        
        Args:
            bucket_name (str): Name of the storage bucket
            file_path (str): Path of the file to delete
            access_token (str, optional): User's access token for RLS
            
        Returns:
            dict: Success status
        """
        try:
            supabase = get_supabase_client()
            
            # Set auth token if provided (for RLS)
            if access_token:
                supabase.auth.set_auth(access_token)
            
            response = supabase.storage.from_(bucket_name).remove([file_path])
            
            if response.error:
                logger.error(f"Supabase storage delete error: {response.error}")
                raise ValidationError(response.error.message)
            
            return {
                "success": True
            }
            
        except Exception as e:
            logger.error(f"Error deleting file: {str(e)}")
            raise
    
    @staticmethod
    def list_files(bucket_name, folder_path=None, access_token=None):
        """
        List files in a Supabase Storage bucket.
        
        Args:
            bucket_name (str): Name of the storage bucket
            folder_path (str, optional): Path of the folder to list
            access_token (str, optional): User's access token for RLS
            
        Returns:
            list: List of files
        """
        try:
            supabase = get_supabase_client()
            
            # Set auth token if provided (for RLS)
            if access_token:
                supabase.auth.set_auth(access_token)
            
            response = supabase.storage.from_(bucket_name).list(folder_path or '')
            
            if response.error:
                logger.error(f"Supabase storage list error: {response.error}")
                raise ValidationError(response.error.message)
            
            return {
                "success": True,
                "files": response
            }
            
        except Exception as e:
            logger.error(f"Error listing files: {str(e)}")
            raise
    
    @staticmethod
    def create_signed_url(bucket_name, file_path, expires_in=60, access_token=None):
        """
        Create a signed URL for a file in Supabase Storage.
        
        Args:
            bucket_name (str): Name of the storage bucket
            file_path (str): Path of the file
            expires_in (int, optional): Expiration time in seconds
            access_token (str, optional): User's access token for RLS
            
        Returns:
            str: Signed URL
        """
        try:
            supabase = get_supabase_client()
            
            # Set auth token if provided (for RLS)
            if access_token:
                supabase.auth.set_auth(access_token)
            
            response = supabase.storage.from_(bucket_name).create_signed_url(
                file_path,
                expires_in
            )
            
            if response.error:
                logger.error(f"Supabase storage signed URL error: {response.error}")
                raise ValidationError(response.error.message)
            
            return {
                "success": True,
                "signed_url": response.get('signedURL')
            }
            
        except Exception as e:
            logger.error(f"Error creating signed URL: {str(e)}")
            raise 