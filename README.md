# 🛍️ Customer Intent Analyzer

An interactive web app that predicts **customer intent** based on e-commerce behavior using a machine learning model. It classifies customers as **Loyal**, **Normal**, or **Fraudulent**, helping businesses better understand and respond to customer engagement.

> 🔗 **Live Demo (Frontend):** [Customer Intent Analyzer](https://mihirbpatel1.github.io/customer-intent-analyzer/)  
> 🚀 **Backend API:** Hosted via Replit or Render  
> 📁 **Model:** Trained locally using `scikit-learn`

---

## 🎯 Features

- 🧠 **ML-powered prediction** of customer intent
- 📈 **Charts & visualizations** (Pie & Bar) of prediction history
- 💾 **Local history tracking** with CSV export
- 🌗 **Dark/light mode toggle**
- 🧪 **Sample data buttons** for quick testing
- 🔁 **API-first** backend using FastAPI

---

## 📊 Prediction Labels

| Label        | Description                            |
|--------------|----------------------------------------|
| **Loyal**     | High engagement, frequent purchases     |
| **Normal**    | Average/expected customer behavior      |
| **Fraudulent**| Suspicious or potentially risky behavior|

---

## 🧠 Tech Stack

### 🖥️ Frontend
- React.js (Vite)
- Tailwind CSS
- Axios
- Recharts (Charts)

### ⚙️ Backend
- Python 3.11+
- FastAPI
- scikit-learn
- pandas, joblib, numpy
- Hosted on Replit / Render

---

## 🧪 Model Training

The backend model is trained using a `train_model.py` script that:
- Preprocesses tabular e-commerce customer data
- Encodes categorical variables
- Trains a DecisionTreeClassifier
- Saves the model to `model/classifier.pkl`

> 📁 Make sure to re-train if you update the data schema.

---

## 🚀 How to Run Locally

### 📦 Backend

```bash
# 1. Navigate to backend/
cd backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # or .\venv\Scripts\activate on Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Train the model
python train_model.py

# 5. Start FastAPI server
uvicorn main:app --reload --port 8000
```

### 🌐 Frontend

```bash
# 1. Navigate to frontend/
cd frontend

# 2. Install frontend dependencies
npm install

# 3. Start dev server
npm run dev
```

---

## 🔐 CORS Setup

If you're hosting the frontend separately (e.g., GitHub Pages), ensure CORS is configured in `main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://mihirbpatel1.github.io"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📦 Export Prediction History

Click the **📤 Export CSV** button to download all predictions saved locally in your browser.

---

## 📌 To-Do / Improvements

- [ ] Add user authentication
- [ ] Connect to a database for persistent logging
- [ ] Enhance model with deep learning
- [ ] Improve mobile responsiveness

---

## 📄 License

MIT License — free to use and modify!

---

## 🙌 Acknowledgements

Thanks to:
- [scikit-learn](https://scikit-learn.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [GitHub Pages](https://pages.github.com/)

---

> Built with ❤️ by Mihir Patel
