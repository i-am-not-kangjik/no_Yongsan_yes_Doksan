from fastapi import FastAPI
from typing import Optional
from pydantic import BaseModel
from Seller_data_Preprocessor import seller_data_processor

app = FastAPI()

class Item(BaseModel):
    product_name: str
    capacity: int
    quality: str

@app.post("/predict_price")
async def predict_price(item: Item):
    input_data = seller_data_processor(item.product_name, item.capacity, item.quality)
    input_data_result = input_data.execute()
    return input_data_result


    
    