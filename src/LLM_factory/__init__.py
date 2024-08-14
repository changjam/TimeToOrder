from .LLM import LLM
from .openAI_LLM import openAI_LLM
from .ollama_LLM import ollama_LLM
from .phi_vision_LLM import phi_vision_LLM




def build_LLM(use_model: str, **kwargs) -> LLM | None:
    match use_model:
        case 'openAI_LLM':
            return openAI_LLM(**kwargs)
        case 'ollama_LLM':
            return ollama_LLM(**kwargs)
        case 'phi_vision_LLM':
            return phi_vision_LLM(**kwargs)
        case _:
            print(f"Invalid model name: {use_model}")
            return None