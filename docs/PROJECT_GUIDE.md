# Ayewo project guide

This guide is for a Python learner returning to neural networks. Start with `main.py`, then `app/inference.py`, then the frontend. You do not need to understand every PyTorch detail before you can demo or improve Ayewo.

## The project in plain English

The browser uploads a blood-smear image. `main.py` checks that it is a real, reasonably sized image and sends it to `MalariaInferenceService`. That service turns the image into numbers, asks the trained neural network to choose one of two labels, and returns the winning label plus its probability. The UI displays the result and asks for human confirmation where appropriate.

## File-by-file map

| File | What it does | Key ideas to understand |
| --- | --- | --- |
| `main.py` | Defines the FastAPI application and HTTP routes. Validates uploads, calls the model without blocking the async server, keeps recent batch summaries in memory, and serves the built frontend in deployment. | HTTP request/response, async I/O, application lifespan, `run_in_threadpool`. |
| `app/inference.py` | Builds MobileNetV2, loads `malaria_model.pth`, preprocesses images, makes predictions, and optionally creates Grad-CAM heat maps. | tensors, transforms, softmax, `eval()`, inference mode. |
| `app/reporting.py` | Creates a lightweight PDF table for a batch. | bytes held in memory; ReportLab canvas coordinates. |
| `train.py` | Downloads images through `ImageFolder`, splits them 80/20, fine-tunes MobileNetV2, prints validation accuracy each epoch, and saves model weights. | transfer learning, epochs, loss, optimizer, validation. |
| `malaria_dataset.py` | Uses KaggleHub to download the NIH/Kaggle cell-image dataset locally. | dataset acquisition only; it is not used during prediction. |
| `malaria_model.pth` | The learned numeric weights created by `train.py`. It is essential for the shipped demo. | model parameters, not Python code; treat it as a versioned artifact. |
| `requirements.txt` | Python packages needed by the running service. | dependency versions keep other machines reproducible. |
| `frontend/src/App.jsx` | The entire React screen: uploads, API calls, result cards, safety copy, and PDF download. | React state (`useState`), file `FormData`, `fetch`. |
| `frontend/src/main.jsx` | Mounts the React app into the page. | React entry point. |
| `frontend/src/styles.css` | Visual styling for the interface. | CSS layout and responsive presentation. |
| `frontend/index.html` | Minimal HTML shell that Vite fills with the React app. | the page root element. |
| `frontend/vite.config.js` | Vite configuration and local development API proxy. | proxy removes local CORS friction. |
| `frontend/package.json` | Frontend dependencies and commands. | `npm run dev` and `npm run build`. |
| `test_normal.png`, `test_parasitic.png` | Demo images for rehearsing the screening flow. | Do not describe them as clinical validation data. |
| `Dockerfile` | Reproducible deployment recipe: build React, install Python requirements, then run FastAPI. | multi-stage Docker build; one hosted URL. |
| `render.yaml` | Render Blueprint configuration. | infrastructure-as-code for a repeatable host setup. |
| `.gitignore` / `.dockerignore` | Prevent secrets, virtual environments, and bulky generated files entering Git or Docker builds. | secret hygiene and smaller builds. |

## Neural-network refresher, using Ayewo

### 1. An image is a NumPy-like array

A 224×224 RGB image can be thought of as a three-dimensional array: height × width × colour channels. `ToTensor()` converts it into a PyTorch tensor, arranged as channels × height × width. A tensor is like a NumPy array that can run on a GPU and participate in automatic differentiation.

### 2. Preprocessing must match training

`Resize((224, 224))` gives every input the shape MobileNetV2 expects. `Normalize(mean, std)` shifts/scales pixel values so their distribution resembles the data used to pretrain the base model. Inconsistent preprocessing is one of the fastest ways to make a good model behave badly.

### 3. What MobileNetV2 does

MobileNetV2 is a convolutional neural network (CNN): small learned filters scan across the image and build progressively richer features, from edges to cell structures. It is relatively compact, which makes it a practical starting point for a CPU-hosted demo. The final classifier layer is replaced with two outputs for Ayewo’s two classes.

### 4. Training loop: the bridge from XOR

Your XOR network probably followed this pattern, and `train.py` does the same at a larger scale:

```text
images → model → output scores → loss against correct labels
       ← gradients ← backpropagation ←
optimizer updates weights
```

`CrossEntropyLoss` measures how wrong the two class scores are. `loss.backward()` calculates gradients. `Adam` uses those gradients to adjust parameters. One **epoch** means the model has seen the full training set once.

### 5. Probability and confidence

The model returns two raw numbers called **logits**. `softmax` turns them into two non-negative values that add to 1. Ayewo reports the larger one as a percentage. That is a model score, not a guarantee of clinical correctness; it can be poorly calibrated or fail on images unlike its training data. The 75% flag is a workflow guardrail, not a medical threshold.

### 6. Why `model.eval()` and `torch.inference_mode()`

`eval()` switches layers such as dropout/batch normalization into prediction behaviour. `inference_mode()` tells PyTorch it does not need to store gradient information, reducing inference overhead. Grad-CAM is the exception because it intentionally needs gradients to create an explanation image.

## Important limits to say out loud

- The random split in `train.py` is useful for a demo but is not a clinical validation study.
- The code does not currently record model version, dataset version, sensitivity, specificity, or calibration metrics.
- Batch reports live only in server memory, so they disappear after a restart and are not an electronic health record.
- The app accepts images but has no authentication, encryption-at-rest, audit trail, or patient-data governance layer. Do not deploy with real patient data.

## Sensible next improvements

1. Add a fixed, patient-level train/validation/test split and save measured sensitivity, specificity, ROC-AUC, and confusion matrix.
2. Test on images from a different device/site to measure generalization.
3. Persist reports securely only after agreeing a clinical data policy.
4. Add login, role-based access, audit logs, and a validated clinical workflow before any real-world use.
5. Version the model and surface its validation metrics inside the interface.
