import os
import json

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from model import Input_Image_Obj
from typing import List, Dict

from lib import *
from LLM_factory import build_LLM
from prompt_lib import MENU_OCR_PROMPT




app = FastAPI()
# 設定 CORS 標頭
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允許的前端網域
    allow_credentials=True,
    allow_methods=["*"],  # 允許的 HTTP 方法
    allow_headers=["*"],  # 允許的 HTTP 標頭
)


@app.on_event('startup')
def startup():
    global LLM_Instance

    load_dotenv()
    USE_MODEL = os.environ['USE_MODEL']
    MODEL_NAME = os.environ['MODEL_NAME']
    API_KEY = os.environ['API_KEY']
    LLM_Instance = build_LLM(USE_MODEL, **{'model_name': MODEL_NAME, 'api_key': API_KEY})


@app.post("/ocr_detect")
@catch_error
def ocr_detect(input_image_obj: Input_Image_Obj) -> Dict:
    image_name, image_base64_encode = input_image_obj
    response = LLM_Instance.generate(prompt = MENU_OCR_PROMPT, b64_image = image_base64_encode)
    if not response:
        return Errors.GENERATION_ERROR
    response['result'] = parse_json_string(response['result'])
    return JSONResponse(status_code=200, content={"image_name": image_name, "result": response})

@catch_function_error
def parse_json_string(input_str: str) -> List[Dict]:
    json_str = input_str.strip().strip('<json>').strip('</json>')
    parsed_json = json.loads(json_str)
    return parsed_json