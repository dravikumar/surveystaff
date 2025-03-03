from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from ai_services.orchestrator import AIOrchestrator
from supabase_integration.client import get_supabase_client
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
