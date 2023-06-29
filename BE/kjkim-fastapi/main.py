from fastapi import FastAPI
from typing import Optional
from pydantic import BaseModel
from Seller_data_Preprocessor import seller_data_processor
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS 설정
origins = [
    "http://localhost:3000",
    "http://13.124.46.240:3000"
    # 다른 허용할 Origin을 필요에 따라 추가할 수 있습니다.
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Item(BaseModel):
    product_name: str
    capacity: int
    quality: str

# @app.post("/predict_price")
# async def predict_price(item: Item):
#     input_data = seller_data_processor(item.product_name, item.capacity, item.quality)
#     input_data_result = input_data.execute()
#     return input_data_result

@app.post("/predict_price")
async def predict_price(item: Item):
    try:
        input_data = seller_data_processor(item.product_name, item.capacity, item.quality)
        input_data_result = input_data.execute()
        return input_data_result
    except Exception as e:
        return {"error": str(e)}

