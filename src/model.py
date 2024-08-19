from pydantic import BaseModel




class Input_Image_Obj(BaseModel):
    image_name: str
    image_base64_encode: str

    def __iter__(self):
        yield self.image_name
        yield self.image_base64_encode