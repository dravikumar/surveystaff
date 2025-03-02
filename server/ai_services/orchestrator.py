from .openai_service import OpenAIService
import logging

logger = logging.getLogger(__name__)

class AIOrchestrator:
    """
    Orchestrates calls to various AI services.
    """
    
    def __init__(self):
        self.openai_service = OpenAIService()
        # Add other AI services as needed
        
    def process_query(self, query, service="openai", **kwargs):
        """
        Process a query using the appropriate AI service.
        
        Args:
            query (str): The query to process
            service (str): The service to use (default: "openai")
            **kwargs: Additional arguments to pass to the service
            
        Returns:
            dict: The response from the AI service
        """
        try:
            if service == "openai":
                result = self.openai_service.generate_completion(query, **kwargs)
                return {"success": True, "result": result}
            # Add other services as needed
            else:
                logger.warning(f"Unknown service: {service}")
                return {"success": False, "error": f"Unknown service: {service}"}
        except Exception as e:
            logger.error(f"Error processing query: {str(e)}")
            return {"success": False, "error": str(e)} 