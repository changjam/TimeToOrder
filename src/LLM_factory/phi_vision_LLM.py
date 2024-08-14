import os
import torch 
import time
import nvidia_smi
from transformers import AutoModelForCausalLM 
from transformers import AutoProcessor 
from dotenv import load_dotenv

from .utils import catch_error
from .LLM import LLM




class phi_vision_LLM(LLM):
    def __init__(self, model_id: str = 'microsoft/Phi-3-vision-128k-instruct'):
        self.model_id = model_id
        model, processor = self.load_model(model_id)
        self.model = model
        self.processor = processor
        
    @staticmethod
    def get_available_gpu_with_most_memory() -> list[str]:
        nvidia_smi.nvmlInit()
        deviceCount = nvidia_smi.nvmlDeviceGetCount()
        devices = []
        for i in range(deviceCount):
            handle = nvidia_smi.nvmlDeviceGetHandleByIndex(i)
            mem = nvidia_smi.nvmlDeviceGetMemoryInfo(handle)
            free_m = mem.free/1024**2
            devices.append((i, free_m))
        devices.sort(key=lambda x: x[1], reverse=True)
        return [i[0] for i in devices]

    def load_model(self, model_id: str):
        device_list = self.get_available_gpu_with_most_memory()
        load_dotenv()
        use_single_gpu = os.environ['USE_SINGLE_GPU']
        use_single_gpu = True if use_single_gpu == 'true' else False
        
        device = 'auto'
        if use_single_gpu:
            device = 'cuda:' + str(device_list[0])
            
        model = AutoModelForCausalLM.from_pretrained(
                    model_id, 
                    device_map=device, 
                    trust_remote_code=True, 
                    torch_dtype=torch.float16, 
                    _attn_implementation='flash_attention_2'
                )
        processor = AutoProcessor.from_pretrained(
                        model_id, 
                        trust_remote_code=True
                    ) 
        return model, processor

    @catch_error
    def generate(
            self,
            messages: list, 
            images_args: list, 
            generation_kwargs: dict = { 
                "max_new_tokens": 2048, 
                "temperature": 0.8, 
                "do_sample": True, 
            } 
        ) -> dict:

        st = time.time()
        prompt = self.processor.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
        inputs = self.processor(prompt, images_args, return_tensors="pt").to('cuda')
        
        generate_ids = self.model.generate(**inputs, eos_token_id=self.processor.tokenizer.eos_token_id, **generation_kwargs) 

        # remove input tokens 
        generate_ids = generate_ids[:, inputs['input_ids'].shape[1]:]
        response = self.processor.batch_decode(generate_ids, skip_special_tokens=True, clean_up_tokenization_spaces=False)[0] 
        return {'model': self.model_id, 'result': response, 'run_time': round(time.time()-st, 2)}