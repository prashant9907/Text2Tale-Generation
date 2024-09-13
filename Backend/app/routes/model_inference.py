from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import torch
from typing import List

model_inference_router = APIRouter()

class DataRequest(BaseModel):
    fields: str 

class DataResponse(BaseModel) :
    message : str 
    Status_Code: int



@model_inference_router.post('/see_some_dummy_obj', response_model = DataResponse)
async def predict_docKV(request: Request, data_request: DataRequest):
    print("Now running: see_some_dummy_obj")

    print("The dummy obj is: ", str(request.app.state.some_dummy_obj))

    print("Field: ", data_request.fields)

    return DataResponse(
        message = "Processed Succesfully",
        Status_Code = 200,
    )

@model_inference_router.post('/generate/')
async def predict(
    request: Request,
    temperature: float = 0.7,             # Float for temperature
    top_k: int = 50,                      # Ensure `top_k` is an integer
    top_p: float = 0.9,                   # Float for `top_p`
    repetition_penalty: float = 1.0       # Float for `repetition_penalty`
):
    form_data = await request.form()
    text = form_data.get("text")
    max_length = form_data.get('max_length')

    if not text:
        raise HTTPException(status_code=400, detail="Text field is required")

    # Encode the input prompt
    input_ids = request.app.state.tokenizer.encode(text, return_tensors="pt")

    # Generate the attention mask
    attention_mask = torch.ones(input_ids.shape, device=input_ids.device)

    # Generate text using the model with specified parameters
    output = request.app.state.model.generate(
        input_ids,
        attention_mask=attention_mask,     # Use attention mask
        max_length=int(max_length),        # Ensure `max_length` is an integer
        temperature=float(temperature),    # Ensure temperature is float
        top_k=int(top_k),                  # Ensure `top_k` is an integer
        top_p=float(top_p),                # Ensure `top_p` is a float
        repetition_penalty=float(repetition_penalty),  # Repetition penalty as float
        pad_token_id=request.app.state.tokenizer.eos_token_id,  # Set pad token to `eos_token_id`
        do_sample=True,                    # Whether to sample (True for creative text generation)
        num_return_sequences=1             # Number of sequences to generate
    )

    # Decode and return the generated text
    output_text = request.app.state.tokenizer.decode(output[0], skip_special_tokens=True)
    return {"generated_text": output_text}