from PIL import Image as Img
from io import BytesIO
import base64
import traceback



def catch_error(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            traceback.print_exc()
            print({e})
            return None
    return wrapper


def async_catch_error(func):
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except Exception as e:
            traceback.print_exc()
            print(e)
            return None
    return wrapper


@catch_error
def pil_image_to_base64(image: Img) -> str:
    buffered = BytesIO()
    image.save(buffered, format="PNG")
    image_bytes = buffered.getvalue()
    image_base64 = base64.b64encode(image_bytes).decode('utf-8')
    return image_base64