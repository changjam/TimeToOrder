## Start
#### 1. Setup .env
```
# .env
USE_MODEL=openAI_LLM
MODEL_NAME=gpt-4o-mini
API_KEY=abc
```
#### 2. Launch api
```bash
pip install -r requirements.txt
cd src/
uvicorn OCR:app --host 0.0.0.0 --port 8000
```

## Input
```bash
curl -X 'POST' \
  'http://127.0.0.1:8000/ocr_detect' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "image_name": "menu.jpg",
  "image_base64_encode": "...",
}'
```

## Output
```json
# image_size: 1670*2355
{
  "image_name": "menu.jpg",
  "result": {
    "model": "gpt-4o-mini",
    "completion_tokens": 832,
    "prompt_tokens": 37296,
    "total_tokens": 38128,
    "result": [
      {
        "name": "水晶魚 (小)",
        "price": "240"
      },
      {
        "name": "水晶魚 (中)",
        "price": "360"
      },
        ...
    ],
    "run_time": 12.02
  }
}
```