# Ayewo — AI-assisted malaria smear screening

> **One-line pitch:** Ayewo helps laboratory teams triage digital blood-smear images quickly, explain the AI signal, and produce a shareable batch report—while keeping the clinician in control.

**Live demo:** _Add your deployed URL here after deployment_

**Demo samples:** `test_normal.png` and `test_parasitic.png`
**Team:** _Add team members and roles here_

> **Clinical safety note:** Ayewo is a hackathon prototype and clinical decision-support tool. It does not diagnose malaria, replace microscopy/RDT confirmation, clinician judgement, or local escalation pathways.

## Why Ayewo

Malaria remains a high-volume diagnostic problem. When a laboratory receives many digital smear images, staff must review them carefully, record results, and communicate which samples need attention. That workflow can be slow and repetitive, especially when staff time is limited.

Ayewo is designed as a **triage layer**, not an autonomous clinician. It gives a laboratory professional a fast first-pass classification of smear images, visibly flags uncertain cases for manual review, supports up to 50 images in one request, and generates a PDF report for the batch. The intended result is that experts can focus their attention where it matters most.

## What a doctor or laboratory team gets

| Feature | Practical value |
| --- | --- |
| Single-image screen | A rapid first look at one digital smear image. |
| Batch screen (up to 50) | Reduces repetitive upload-and-check work for a set of samples. |
| Confidence + review flag | Scores below 75% are visibly marked for manual review instead of being treated as certain. |
| AI attention map | In single-sample API calls, Grad-CAM can show image regions that influenced the model. |
| Patient-risk prompt | The interface keeps severe symptoms and higher-risk patients in view; it never delays clinical escalation. |
| PDF batch report | Makes it easier to hand results to the laboratory workflow for confirmation and documentation. |

### Time-saving claim, stated honestly

Ayewo automates the **first-pass digital-image triage and batch summary**, so it can reduce manual, image-by-image sorting. We do **not** claim a clinically validated number of minutes saved yet. Before making that claim, measure it in a supervised local pilot: compare the same batch workflow with and without Ayewo, record turnaround time and confirmation agreement, and report the result.

## How it works

```text
Microscope/camera image
        ↓
React web interface (single or batch upload)
        ↓
FastAPI validates image size/type
        ↓
MobileNetV2 classifier (PyTorch)
        ↓
Prediction + confidence + low-confidence flag
        ↓
Clinical review screen / optional Grad-CAM / PDF batch report
```

The model is a **fine-tuned MobileNetV2** classifier with two output labels: `Parasitized` and `Uninfected`. Images are resized to 224×224, converted to tensors, and normalized with ImageNet statistics. During training, the project uses an 80/20 random train/validation split and cross-entropy loss with Adam. Inference runs in batches for efficiency. Grad-CAM is optional because generating explanations requires an additional backward pass.

## Run locally

### Quick demo (two terminals)

From this repository folder:

```powershell
# Terminal 1 — Python API
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

```powershell
# Terminal 2 — browser UI
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite (normally `http://127.0.0.1:5173`). The Vite proxy forwards API calls to port 8000. Upload `test_normal.png` or `test_parasitic.png` for a safe demo flow.

### API endpoints

| Endpoint | Purpose |
| --- | --- |
| `GET /health` | Confirms that the server and model are ready. |
| `POST /predict/single` | Screens one image; Grad-CAM is enabled by default. |
| `POST /predict/batch` | Screens 1–50 images and returns a `batch_id`. |
| `GET /report/{batch_id}` | Downloads the in-memory PDF report for that batch. |
| `GET /docs` | Interactive FastAPI API documentation. |

## Deploy the demo on Render

This repository includes a `Dockerfile` and `render.yaml`. The container builds the React interface and serves it from the same FastAPI URL as the model API, so there is no second frontend deployment or API URL to configure.

1. Create a **private or public GitHub repository** and push the contents of this `Ayewo` folder, including `malaria_model.pth`.
2. In Render, select **New → Blueprint** (or **New → Web Service**), connect the repository, and choose the supplied `render.yaml` / Docker runtime.
3. Deploy. Render will build the image and give you an `onrender.com` URL. Set `/health` as the health-check path if Render does not read it from the blueprint.
4. Open the URL, wait for the model to load, and test the two demo images. Then paste that URL at the top of this README before submission.

Render requires web services to listen on `0.0.0.0` and its assigned `PORT`; the included Docker command does both. Free services can sleep after inactivity, so open the demo a few minutes before judging and keep a local demo running as backup. See [Render's FastAPI guide](https://render.com/docs/deploy-fastapi) and [Docker guide](https://render.com/docs/docker).

## Submission checklist

- [ ] Put the live URL in the **Live demo** line above.
- [ ] Add every team member and their real contribution.
- [ ] Ensure `malaria_model.pth` is committed; a clone must start without files from your laptop.
- [ ] Never commit `.env.local`, API keys, tokens, patient identifiers, or real patient images.
- [ ] Run `python -m unittest discover -s tests` and `npm run build` in `frontend`.
- [ ] Rehearse a 2–3 minute story: problem → upload a sample → explain confidence/manual review → show batch PDF → safety statement.

## For the presentation

**30-second pitch:** “Ayewo is an AI-assisted malaria-smear screening tool for laboratory teams. It triages digital smear images, clearly sends uncertain cases back to a human reviewer, screens batches of up to 50 samples, and generates a PDF summary. It is designed to speed up the first pass—not to replace trained laboratory professionals or clinical confirmation.”

**Best demo sequence:** upload `test_parasitic.png`; point out the clear attention status and safety statement; switch to batch mode with both demo images; download the report; end with the human-in-the-loop safeguard.

## Learn the codebase

Read [docs/PROJECT_GUIDE.md](docs/PROJECT_GUIDE.md) for a friendly, file-by-file explanation, including the Python/NumPy/neural-network concepts behind the project.
