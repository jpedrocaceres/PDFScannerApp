# PDF Scanner App

Aplicativo mobile para digitalização de documentos e conversão para PDF.

## Tecnologias Utilizadas

### Frontend (Mobile)
- React Native com Expo
- React Native Camera
- React Native PDF
- TypeScript
- Expo Image Picker
- React Navigation

### Backend
- Python 3.9+
- FastAPI
- Tesseract OCR
- OpenCV
- PyPDF2

## Estrutura do Projeto

```
PDFScannerApp/
├── mobile/                 # Aplicativo React Native
│   ├── app/               # Telas do aplicativo
│   ├── components/        # Componentes reutilizáveis
│   ├── hooks/            # Custom hooks
│   ├── services/         # Serviços de API
│   └── utils/            # Funções utilitárias
│
└── backend/              # API Python
    ├── app/             # Código principal
    ├── services/        # Serviços de processamento
    └── tests/           # Testes unitários
```

## Como Executar

### Mobile
1. Instale as dependências:
```bash
   npm install
```

2. Start the app

   ```bash
    npx expo start
   ```

3. Use o app Expo Go no seu dispositivo Android para testar

### Backend
1. Crie um ambiente virtual:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

2. Instale as dependências:
```bash
pip install -r backend\requirements.txt
```

3. Inicie o servidor:
```bash
uvicorn app.main:app --reload
```

## Funcionalidades

- Captura de documentos via câmera
- Processamento de imagem (remoção de ruído, correção de perspectiva)
- Reconhecimento de texto (OCR)
- Geração de PDF
- Armazenamento local dos documentos
- Compartilhamento de documentos

## Boas Práticas Implementadas

1. **Clean Architecture**
   - Separação clara de responsabilidades
   - Código modular e testável
   - Dependências bem definidas

2. **TypeScript**
   - Tipagem estática para maior segurança
   - Melhor autocompletar e documentação
   - Redução de erros em runtime

3. **Componentes Reutilizáveis**
   - DRY (Don't Repeat Yourself)
   - Manutenção mais fácil
   - Consistência na UI

4. **Testes**
   - Testes unitários
   - Testes de integração
   - Testes de UI

5. **Segurança**
   - Validação de dados
   - Sanitização de inputs
   - Tratamento de erros
