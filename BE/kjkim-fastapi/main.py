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
    data1 = seller_data_processor(item.product_name, item.capacity, item.quality)
    # processor.basic_adding()
    # processor.map_phone_info()
    # processor.assign_h_time()
    # processor.convert_as_used_year()
    # processor.extract_and_map_quality()
    # processor.calculate_avg_fav_and_view()
    # processor.change_data_type()
    # processor.modeling_Preprocessor()
    # processor.load_no_scaling_price_prdict_model()
    # result = processor.generate_result_string()
    # return {"result": result}
    # data1 = seller_data_processor('갤럭시 Z 폴드3', 256, 'B급')
    data1_result = data1.execute()
    # result = processor.generate_result_string()
    return {"result": data1_result}
    