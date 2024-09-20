from .LLM import LLM
from .openAI_LLM import openAI_LLM




def build_LLM(use_model: str, **kwargs) -> LLM | None:
    match use_model:
        case 'openAI_LLM':
            return openAI_LLM(**kwargs)
        case _:
            print(f"Invalid model name: {use_model}")
            return None