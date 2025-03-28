from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import uvicorn
import cv2
import numpy as np
import pytesseract
from PyPDF2 import PdfWriter, PdfReader
import io

app = FastAPI(
    title="PDF Scanner API",
    description="API para processamento de imagens e geração de PDFs",
    version="1.0.0"
)

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique as origens permitidas
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "PDF Scanner API está funcionando!"}

@app.post("/process-image")
async def process_image(file: UploadFile = File(...)):
    try:
        # Lê a imagem
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Pré-processamento da imagem
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        denoised = cv2.fastNlMeansDenoising(gray)
        
        # Aplicar threshold adaptativo
        thresh = cv2.adaptiveThreshold(
            denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
            cv2.THRESH_BINARY, 11, 2
        )
        
        # OCR
        text = pytesseract.image_to_string(thresh, lang='por')
        
        return {
            "text": text,
            "message": "Imagem processada com sucesso"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/create-pdf")
async def create_pdf(files: List[UploadFile] = File(...)):
    try:
        pdf_writer = PdfWriter()
        
        for file in files:
            # Processa cada imagem
            contents = await file.read()
            nparr = np.frombuffer(contents, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            # Converte para PDF
            # Aqui você implementaria a lógica de conversão de imagem para PDF
            # Por enquanto, retornamos um placeholder
            pdf_writer.add_blank_page(width=612, height=792)
        
        # Salva o PDF em memória
        output = io.BytesIO()
        pdf_writer.write(output)
        output.seek(0)
        
        return {
            "message": "PDF criado com sucesso",
            "pdf_size": len(output.getvalue())
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 