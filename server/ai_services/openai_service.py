import openai
from django.conf import settings
import logging
import os
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

class OpenAIService:
    """
    Service for interacting with OpenAI APIs.
    """
    
    def __init__(self):
        # Load environment variables from .env file
        # env_file = os.path.join(settings.BASE_DIR, '.env')
        # if os.path.exists(env_file):
        #     # Force reload to ensure we get the latest values
        #     load_dotenv(env_file, override=True)
        load_dotenv()
        # Get API key from environment or fall back to settings
        api_key = os.getenv('OPENAI_API_KEY')
        openai.api_key = api_key if api_key else settings.OPENAI_API_KEY
                    
    def generate_completion(self, prompt, model="gpt-4o-mini", max_tokens=1000):
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