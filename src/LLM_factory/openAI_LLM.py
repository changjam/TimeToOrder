import os
import time
from dotenv import load_dotenv
from openai import OpenAI
from PIL import Image
from .utils import catch_error, pil_image_to_base64
from .LLM import LLM




load_dotenv()


class openAI_LLM(LLM):
    def __init__(self, model_name: str = 'gpt-4o-mini', api_key: str = os.environ['OPENAI_API_KEY']):
        self.model_name = model_name
        self.client = OpenAI(api_key=api_key)

    @catch_error
    def generate(
            self, 
            prompt: str, 
            pil_image: Image = None
        ) -> dict:

        st = time.time()
        
        # 1. Set prompt
        message = [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt}
                ]
            }
        ]
        if pil_image:
            message[0]['content'].append({"type": "image_url", "image_url": { "url": f"data:image/png;base64,{pil_image_to_base64(pil_image)}"}})


        # 2. Generate model
        response = self.client.chat.completions.create(
            model=self.model_name,
            messages=message,
            max_tokens=1024,
        )


        # 3. Handle result
        model_response = {
            'model': self.model_name,
            'completion_tokens': response.usage.completion_tokens,
            'prompt_tokens': response.usage.prompt_tokens,
            'total_tokens': response.usage.total_tokens,
            'result': response.choices[0].message.content,
            'run_time': round(time.time()-st, 2)
        }
        return model_response