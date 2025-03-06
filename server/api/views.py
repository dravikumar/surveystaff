from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from ai_services.orchestrator import AIOrchestrator
from supabase_integration.client import get_supabase_client, get_supabase_url, get_supabase_anon_key
from supabase_integration.auth import SupabaseAuth
from supabase_integration.data import SupabaseData
from supabase_integration.storage import SupabaseStorage
import logging

logger = logging.getLogger(__name__)

# Create your views here.

class AIProcessView(APIView):
    """
    API endpoint for processing AI requests.
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        Process an AI request.
        
        Expected payload:
        {
            "query": "The text to process",
            "service": "openai",  # Optional, defaults to "openai"
            "model": "gpt-4o-mini"      # Optional, defaults to "gpt-4o-mini"
        }
        """
        try:
            query = request.data.get('query')   #This would chanage to be the user input right? 
            if not query:
                return Response(
                    {"success": False, "error": "Query is required"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            # Extract service-specific parameters
            service = request.data.get('service', 'openai')
            kwargs = {k: v for k, v in request.data.items() 
                     if k not in ['query', 'service']}
            
            # Set default model if not provided
            if 'model' not in kwargs:
                kwargs['model'] = 'gpt-4o-mini'
            
            # Process the query
            orchestrator = AIOrchestrator()
            result = orchestrator.process_query(query, service=service, **kwargs)
            
            if result.get('success', False):
                return Response({"success": True, "result": result.get('result')})
            else:
                return Response(
                    {"success": False, "error": result.get('error')},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                
        except Exception as e:
            logger.error(f"Error processing AI request: {str(e)}")
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Supabase Configuration View
class SupabaseConfigView(APIView):
    """
    API endpoint to get Supabase configuration for client-side initialization.
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        """
        Get Supabase URL and anon key for client-side initialization.
        """
        try:
            config = {
                "supabaseUrl": get_supabase_url(),
                "supabaseKey": get_supabase_anon_key()
            }
            return Response({"success": True, "config": config})
        except Exception as e:
            logger.error(f"Error getting Supabase config: {str(e)}")
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Authentication Views
class SignUpView(APIView):
    """
    API endpoint for user registration.
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        Register a new user.
        
        Expected payload:
        {
            "email": "user@example.com",
            "password": "securepassword",
            "metadata": {}  # Optional user metadata
        }
        """
        try:
            email = request.data.get('email')
            password = request.data.get('password')
            metadata = request.data.get('metadata', {})
            
            if not email or not password:
                return Response(
                    {"success": False, "error": "Email and password are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            result = SupabaseAuth.sign_up(email, password, metadata)
            
            if result.get('success', False):
                return Response({"success": True, "user": result.get('user')})
            else:
                return Response(
                    {"success": False, "error": result.get('error')},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Error during sign up: {str(e)}")
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class SignInView(APIView):
    """
    API endpoint for user authentication.
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        Authenticate a user.
        
        Expected payload:
        {
            "email": "user@example.com",
            "password": "securepassword"
        }
        """
        try:
            email = request.data.get('email')
            password = request.data.get('password')
            
            if not email or not password:
                return Response(
                    {"success": False, "error": "Email and password are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            result = SupabaseAuth.sign_in(email, password)
            
            if result.get('success', False):
                return Response({
                    "success": True, 
                    "session": result.get('session'),
                    "user": result.get('user')
                })
            else:
                return Response(
                    {"success": False, "error": result.get('error')},
                    status=status.HTTP_401_UNAUTHORIZED
                )
                
        except Exception as e:
            logger.error(f"Error during sign in: {str(e)}")
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class SignOutView(APIView):
    """
    API endpoint for user logout.
    """
    permission_classes = [AllowAny]  # Can be changed to IsAuthenticated if needed
    
    def post(self, request):
        """
        Log out a user.
        """
        try:
            # Get the access token from the request
            access_token = request.data.get('access_token')
            
            if not access_token:
                return Response(
                    {"success": False, "error": "Access token is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            result = SupabaseAuth.sign_out(access_token)
            
            if result.get('success', False):
                return Response({"success": True, "message": "Successfully signed out"})
            else:
                return Response(
                    {"success": False, "error": result.get('error')},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Error during sign out: {str(e)}")
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ResetPasswordView(APIView):
    """
    API endpoint for password reset.
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        Send a password reset email.
        
        Expected payload:
        {
            "email": "user@example.com"
        }
        """
        try:
            email = request.data.get('email')
            
            if not email:
                return Response(
                    {"success": False, "error": "Email is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            result = SupabaseAuth.reset_password(email)
            
            if result.get('success', False):
                return Response({
                    "success": True, 
                    "message": "Password reset email sent"
                })
            else:
                return Response(
                    {"success": False, "error": result.get('error')},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Error during password reset: {str(e)}")
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UserView(APIView):
    """
    API endpoint for user operations.
    """
    permission_classes = [AllowAny]  # Can be changed to IsAuthenticated if needed
    
    def get(self, request):
        """
        Get the current user.
        """
        try:
            # Get the access token from the request
            access_token = request.headers.get('Authorization', '').replace('Bearer ', '')
            
            if not access_token:
                return Response(
                    {"success": False, "error": "Access token is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            result = SupabaseAuth.get_user(access_token)
            
            if result.get('success', False):
                return Response({"success": True, "user": result.get('user')})
            else:
                return Response(
                    {"success": False, "error": result.get('error')},
                    status=status.HTTP_401_UNAUTHORIZED
                )
                
        except Exception as e:
            logger.error(f"Error getting user: {str(e)}")
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def put(self, request):
        """
        Update the current user.
        
        Expected payload:
        {
            "data": {
                "email": "newemail@example.com",  # Optional
                "password": "newpassword",        # Optional
                "metadata": {}                    # Optional
            }
        }
        """
        try:
            data = request.data.get('data', {})
            # Get the access token from the request
            access_token = request.headers.get('Authorization', '').replace('Bearer ', '')
            
            if not access_token:
                return Response(
                    {"success": False, "error": "Access token is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            if not data:
                return Response(
                    {"success": False, "error": "Update data is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # For password updates, use the specific method
            if 'password' in data:
                result = SupabaseAuth.update_password(access_token, data['password'])
                # Remove password from data after updating it separately
                data_copy = data.copy()
                data_copy.pop('password')
                data = data_copy
                
                if not result.get('success', False):
                    return Response(
                        {"success": False, "error": result.get('error')},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # If there are other fields to update, use the Supabase client directly
            if data:
                supabase = get_supabase_client()
                supabase.auth.set_auth(access_token)
                response = supabase.auth.update_user(data)
                
                if response.error:
                    return Response(
                        {"success": False, "error": response.error.message},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                    
                return Response({"success": True, "user": response.user})
            
            return Response({"success": True})
                
        except Exception as e:
            logger.error(f"Error updating user: {str(e)}")
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class SessionView(APIView):
    """
    API endpoint for session operations.
    """
    permission_classes = [AllowAny]  # Can be changed to IsAuthenticated if needed
    
    def get(self, request):
        """
        Get the current session.
        """
        try:
            # Get the access token from the request
            access_token = request.headers.get('Authorization', '').replace('Bearer ', '')
            
            if not access_token:
                return Response(
                    {"success": False, "error": "Access token is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            # Use the Supabase client directly
            supabase = get_supabase_client()
            supabase.auth.set_auth(access_token)
            
            # Get the session
            try:
                session = supabase.auth.get_session()
                
                if session.error:
                    return Response(
                        {"success": False, "error": session.error.message},
                        status=status.HTTP_401_UNAUTHORIZED
                    )
                    
                return Response({"success": True, "session": session.session})
            except Exception as e:
                return Response(
                    {"success": False, "error": str(e)},
                    status=status.HTTP_401_UNAUTHORIZED
                )
                
        except Exception as e:
            logger.error(f"Error getting session: {str(e)}")
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Data Operation Views
class DataView(APIView):
    """
    API endpoint for data operations.
    """
    permission_classes = [AllowAny]  # Can be changed to IsAuthenticated if needed
    
    def post(self, request):
        """
        Create a new record.
        
        Expected payload:
        {
            "table": "table_name",
            "data": {}  # Record data
        }
        """
        try:
            table = request.data.get('table')
            data = request.data.get('data')
            
            if not table or data is None:
                return Response(
                    {"success": False, "error": "Table name and data are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get the access token from the request (optional)
            access_token = request.headers.get('Authorization', '').replace('Bearer ', '') or None
            
            result = SupabaseData.insert_data(table, data, access_token)
            
            if result.get('success', False):
                return Response({"success": True, "data": result.get('data')})
            else:
                return Response(
                    {"success": False, "error": result.get('error')},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Error creating record: {str(e)}")
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def get(self, request):
        """
        Read records from a table.
        
        Query parameters:
        - table: Table name
        - id: Optional record ID
        """
        try:
            table = request.query_params.get('table')
            record_id = request.query_params.get('id')
            
            if not table:
                return Response(
                    {"success": False, "error": "Table name is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get the access token from the request (optional)
            access_token = request.headers.get('Authorization', '').replace('Bearer ', '') or None
            
            # Prepare query parameters
            query_params = {}
            if record_id:
                query_params['id'] = record_id
                
            result = SupabaseData.fetch_data(table, access_token, query_params)
            
            if result.get('success', False):
                return Response({"success": True, "data": result.get('data')})
            else:
                return Response(
                    {"success": False, "error": result.get('error')},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Error reading records: {str(e)}")
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def put(self, request):
        """
        Update a record.
        
        Expected payload:
        {
            "table": "table_name",
            "id": "record_id",
            "data": {}  # Updated data
        }
        """
        try:
            table = request.data.get('table')
            record_id = request.data.get('id')
            data = request.data.get('data')
            
            if not table or not record_id or data is None:
                return Response(
                    {"success": False, "error": "Table name, record ID, and data are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get the access token from the request (optional)
            access_token = request.headers.get('Authorization', '').replace('Bearer ', '') or None
            
            result = SupabaseData.update_data(table, data, 'id', record_id, access_token)
            
            if result.get('success', False):
                return Response({"success": True, "data": result.get('data')})
            else:
                return Response(
                    {"success": False, "error": result.get('error')},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Error updating record: {str(e)}")
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def delete(self, request):
        """
        Delete a record.
        
        Query parameters:
        - table: Table name
        - id: Record ID
        """
        try:
            table = request.query_params.get('table')
            record_id = request.query_params.get('id')
            
            if not table or not record_id:
                return Response(
                    {"success": False, "error": "Table name and record ID are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get the access token from the request (optional)
            access_token = request.headers.get('Authorization', '').replace('Bearer ', '') or None
            
            result = SupabaseData.delete_data(table, 'id', record_id, access_token)
            
            if result.get('success', False):
                return Response({"success": True, "message": "Record deleted successfully"})
            else:
                return Response(
                    {"success": False, "error": result.get('error')},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Error deleting record: {str(e)}")
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class QueryView(APIView):
    """
    API endpoint for complex data queries.
    """
    permission_classes = [AllowAny]  # Can be changed to IsAuthenticated if needed
    
    def post(self, request):
        """
        Execute a complex query.
        
        Expected payload:
        {
            "table": "table_name",
            "query_params": {
                "select": "*",
                "filters": [
                    {"column": "column_name", "operator": "eq", "value": "value"}
                ],
                "order": {"column": "created_at", "ascending": false},
                "limit": 10,
                "offset": 0
            }
        }
        """
        try:
            table = request.data.get('table')
            query_params = request.data.get('query_params', {})
            
            if not table:
                return Response(
                    {"success": False, "error": "Table name is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get the access token from the request (optional)
            access_token = request.headers.get('Authorization', '').replace('Bearer ', '') or None
            
            result = SupabaseData.query_data(table, query_params, access_token)
            
            if result.get('success', False):
                return Response({"success": True, "data": result.get('data')})
            else:
                return Response(
                    {"success": False, "error": result.get('error')},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Error executing query: {str(e)}")
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Storage Operation Views
class StorageView(APIView):
    """
    API endpoint for storage operations.
    """
    permission_classes = [AllowAny]  # Can be changed to IsAuthenticated if needed
    
    def post(self, request):
        """
        Upload a file.
        
        Expected payload:
        {
            "bucket": "bucket_name",
            "path": "file_path",
            "file": file_data,  # Base64 encoded file data
            "content_type": "image/jpeg"  # Optional
        }
        """
        try:
            bucket = request.data.get('bucket')
            path = request.data.get('path')
            file_data = request.data.get('file')
            content_type = request.data.get('content_type')
            
            if not bucket or not path or not file_data:
                return Response(
                    {"success": False, "error": "Bucket, path, and file data are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get the access token from the request (optional)
            access_token = request.headers.get('Authorization', '').replace('Bearer ', '') or None
            
            result = SupabaseStorage.upload_file(bucket, path, file_data, content_type, access_token)
            
            if result.get('success', False):
                return Response({
                    "success": True, 
                    "path": result.get('path'),
                    "url": result.get('url')
                })
            else:
                return Response(
                    {"success": False, "error": result.get('error')},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Error uploading file: {str(e)}")
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def get(self, request):
        """
        Download a file or list files.
        
        Query parameters for download:
        - bucket: Bucket name
        - path: File path
        
        Query parameters for listing:
        - bucket: Bucket name
        - prefix: Optional path prefix
        - limit: Optional limit
        - offset: Optional offset
        - sortBy: Optional sort field
        """
        try:
            bucket = request.query_params.get('bucket')
            path = request.query_params.get('path')
            
            if not bucket:
                return Response(
                    {"success": False, "error": "Bucket name is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # If path is provided, download the file
            if path:
                # Get the access token from the request (optional)
                access_token = request.headers.get('Authorization', '').replace('Bearer ', '') or None
                
                result = SupabaseStorage.download_file(bucket, path, access_token)
                
                if result.get('success', False):
                    return Response({
                        "success": True, 
                        "data": result.get('data'),
                        "content_type": result.get('content_type')
                    })
                else:
                    return Response(
                        {"success": False, "error": result.get('error')},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            # Otherwise, list files
            else:
                prefix = request.query_params.get('prefix')
                limit = request.query_params.get('limit')
                offset = request.query_params.get('offset')
                sort_by = request.query_params.get('sortBy')
                
                # Convert string parameters to appropriate types
                if limit:
                    limit = int(limit)
                if offset:
                    offset = int(offset)
                
                # Get the access token from the request (optional)
                access_token = request.headers.get('Authorization', '').replace('Bearer ', '') or None
                
                result = SupabaseStorage.list_files(bucket, prefix, access_token, limit, offset, sort_by)
                
                if result.get('success', False):
                    return Response({
                        "success": True, 
                        "files": result.get('files')
                    })
                else:
                    return Response(
                        {"success": False, "error": result.get('error')},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
        except Exception as e:
            logger.error(f"Error with storage operation: {str(e)}")
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def delete(self, request):
        """
        Delete a file.
        
        Query parameters:
        - bucket: Bucket name
        - path: File path
        """
        try:
            bucket = request.query_params.get('bucket')
            path = request.query_params.get('path')
            
            if not bucket or not path:
                return Response(
                    {"success": False, "error": "Bucket name and file path are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get the access token from the request (optional)
            access_token = request.headers.get('Authorization', '').replace('Bearer ', '') or None
            
            result = SupabaseStorage.delete_file(bucket, path, access_token)
            
            if result.get('success', False):
                return Response({
                    "success": True, 
                    "message": "File deleted successfully"
                })
            else:
                return Response(
                    {"success": False, "error": result.get('error')},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Error deleting file: {str(e)}")
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PublicUrlView(APIView):
    """
    API endpoint to get public URLs for files.
    **todo: is this something needed? PublicURL view title is a unnerving
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        """
        Get a public URL for a file.
        
        Query parameters:
        - bucket: Bucket name
        - path: File path
        """
        try:
            bucket = request.query_params.get('bucket')
            path = request.query_params.get('path')
            
            if not bucket or not path:
                return Response(
                    {"success": False, "error": "Bucket name and file path are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get the access token from the request (optional)
            access_token = request.headers.get('Authorization', '').replace('Bearer ', '') or None
            
            result = SupabaseStorage.get_public_url(bucket, path, access_token)
            
            if result.get('success', False):
                return Response({
                    "success": True, 
                    "url": result.get('url')
                })
            else:
                return Response(
                    {"success": False, "error": result.get('error')},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Error getting public URL: {str(e)}")
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
