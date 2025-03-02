import openai
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class OpenAIService:
    """
    Service for interacting with OpenAI APIs.
    """
    
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY
        
    def generate_completion(self, prompt, model="gpt-4", max_tokens=1000):
        """
        Generate a completion using OpenAI's API.
        
        Args:
            prompt (str): The prompt to generate a completion for
            model (str): The model to use for generation
            max_tokens (int): Maximum number of tokens to generate
            
        Returns:
            str: The generated text
        """
        try:
            response = openai.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=max_tokens
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Error generating completion: {str(e)}")
            return {"error": str(e)} 