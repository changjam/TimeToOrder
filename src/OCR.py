import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from model import Input_Image_Obj

from LLM_factory import build_LLM, LLM
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
    LLM_Instance: LLM = build_LLM(USE_MODEL, {'model_name': MODEL_NAME, 'api_key': API_KEY})


@app.post("/ocr_detect")
def ocr_detect(input_image_obj: Input_Image_Obj) -> dict:
    image_name, image_base64_encode = input_image_obj
    response = LLM_Instance.generate(prompt = MENU_OCR_PROMPT, b64_image = image_base64_encode)
    result = response.pop('result', None)
    if not result:
        return JSONResponse(status_code=400, content={"image_name": image_name, "result": "Predict_Error"})
    return JSONResponse(status_code=200, content={"image_name": image_name, "result": result})