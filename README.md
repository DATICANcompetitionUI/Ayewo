# Ayewo Backend

Ayewo is an AI-powered malaria blood smear screening backend for resource-limited Nigerian diagnostic labs.

## Tech Stack

- Python 3.10+
- FastAPI
- PyTorch + torchvision (MobileNetV2)
- pytorch-grad-cam
- Pillow
- ReportLab

## Setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Model Training (NIH malaria dataset)

Download and extract the NIH cell image dataset from Kaggle:
https://www.kaggle.com/datasets/iarunava/cell-images-for-detecting-malaria

Expected folder layout:

```text
cell_images/
  Parasitized/
  Uninfected/
```

Train for at least 5 epochs and save as `malaria_model.pth`:

```bash
python train.py --data-dir /path/to/cell_images --epochs 5 --output malaria_model.pth
```

## Run API

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## API Examples

### 1) `POST /predict/single`

```bash
curl -X POST "http://127.0.0.1:8000/predict/single" \
  -F "file=@/absolute/path/to/image.png"
```

Replace `/absolute/path/to/image.png` with your actual local image path.

### 2) `POST /predict/batch`

```bash
curl -X POST "http://127.0.0.1:8000/predict/batch" \
  -F "files=@/absolute/path/to/image1.png" \
  -F "files=@/absolute/path/to/image2.png"
```

### 3) `GET /health`

```bash
curl "http://127.0.0.1:8000/health"
```

### 4) `GET /report/{batch_id}`

```bash
curl -L "http://127.0.0.1:8000/report/<batch_id>" -o batch_report.pdf
```

## Notes

- CORS is enabled for all origins for frontend integration.
- Predictions below 75% confidence are flagged with `low_confidence: true`.
- No authentication, user accounts, or database are used.

## Frontend (React + Vite)

The frontend application is located in `/home/runner/work/Ayewo/Ayewo/iayodeji/Ayewo/frontend`.

### Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` in `.env` if your backend runs on a different host/port.

### Frontend pages

1. Dashboard (`/`)
2. Single Screening (`/single-screening`)
3. Batch Screening (`/batch-screening`)

### Frontend build

```bash
cd frontend
npm run lint
npm run build
```

### Deploy frontend on Vercel

- Import the repository in Vercel.
- Set the project root directory to `frontend`.
- Build command: `npm run build`
- Output directory: `dist`
- Add environment variable `VITE_API_BASE_URL` to your deployed backend URL.
