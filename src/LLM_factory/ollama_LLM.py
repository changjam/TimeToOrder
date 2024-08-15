import os
import time
import requests
from dotenv import load_dotenv

from .utils import catch_error
from .LLM import LLM




load_dotenv()
class ollama_LLM(LLM):
    
    def __init__(self, model_name: str = 'llama3:8b-instruct-fp16', api_url: str = os.environ['OLLAMA_HOST']):
        self.model_name = model_name
        self.api_url = api_url
        
    @catch_error
    def generate(
            self,
            prompt: str = '', 
            json_format: bool = False
        ) -> dict:

        st = time.time()
        payload = {
            "model": self.model_name,
            "stream": False,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "options": {
                "num_ctx": 8000
            }
        }

        if json_format:
            payload['messages'].append({"role": "assistant", "content": "{"})

        response = requests.post(self.api_url, json=payload, timeout=300)
        res = response.json()
        result = res['message']['content']
        
        if json_format:
            result = result if result[0] == '{' else '{' + result

        model_response = {
            'model': self.model_name,
            'eval_count': res['eval_count'],
            'result': result,
            'run_time': round(time.time()-st, 2)
        }
        if 'prompt_eval_count' in res:
            model_response['prompt_eval_count'] = res['prompt_eval_count']

        return model_response