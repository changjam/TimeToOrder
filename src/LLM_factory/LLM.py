import json
from json_repair import repair_json
import re






class LLM:
    def __init__(self):
        pass
    
    @staticmethod
    def get_xml_result(response: str, tags_name: str) -> str | None:
        try:
            pattern = re.compile(r'<{}>(.*?)</{}>'.format(tags_name, tags_name), re.DOTALL)
            match = pattern.search(response)
            if not match:
                print('Tag not found in the string.', tag='warning', tag_color='yellow', color='white')
                return None
            result = match.group(1).strip()
            return result
        except Exception as e:
            print(f"[get_xml_result Error]: return None :{e}")
            return None

    @staticmethod
    def get_json_result(output: str) -> dict | None:
        try:
            if output is None or output == '':
                return None
            return json.loads(repair_json(output))
        except Exception as e:
            print(f"[get_json_result Error]: return None")
            return None