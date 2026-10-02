# Hybrid AI Anomaly Detection for Network Traffic

### Explainable Network Threat Analysis using Hybrid Machine Learning

A web-based AI system that demonstrates how **supervised learning, unsupervised anomaly detection, and Explainable AI (XAI)** can be combined to analyze network traffic and identify potentially suspicious behavior.

The project simulates a hybrid detection pipeline using **Random Forest + Autoencoder**, provides **SHAP-based feature explanations**, and presents the analysis through an interactive React dashboard.

> **Project Type:** AI/ML Research & Prototyping
> **Domain:** Cybersecurity / Network Anomaly Detection
> **Frontend:** React + TypeScript
> **AI Integration:** Google Gemini API
> **Build Tool:** Vite

---

## Overview

Modern network environments generate large volumes of traffic, making it difficult to identify unusual behavior using traditional rule-based approaches alone.

This project explores a hybrid approach where different machine-learning techniques address different parts of the detection problem:

* **Random Forest** → supervised classification of known traffic patterns
* **Autoencoder** → unsupervised detection of unusual traffic behavior
* **Hybrid analysis** → combines insights from both approaches
* **SHAP** → explains which features contribute to a detection
* **Gemini AI** → powers the simulated analysis layer
* **Interactive dashboard** → visualizes metrics, anomalies, explanations, and real-time activity

The application is designed as a **conceptual and educational prototype** for understanding how an explainable hybrid anomaly-detection system can be structured.

---

## Why a Hybrid Approach?

A single machine-learning model can have limitations when analyzing complex network traffic.

### Supervised Detection

Supervised models such as Random Forest work well when labeled training data is available.

They can learn patterns associated with known classes of traffic and attacks.

**Limitation:** They depend heavily on the quality and coverage of labeled training data.

### Unsupervised Detection

Autoencoders learn representations of normal behavior and can identify observations that reconstruct poorly or differ significantly from learned patterns.

**Limitation:** Unusual legitimate traffic can also appear anomalous.

### Hybrid Detection

This project combines the two concepts:

```text
                 Network Traffic
                       │
                       ▼
                Data Processing
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
      Random Forest          Autoencoder
      Supervised Model      Anomaly Model
             │                   │
             └─────────┬─────────┘
                       │
                       ▼
                Hybrid Analysis
                       │
                       ▼
              Explainable Results
                       │
                       ▼
                 SHAP Insights
                       │
                       ▼
                Dashboard Output
```

The goal is to demonstrate how supervised classification and anomaly detection can complement each other.

---

# Key Features

## 1. CSV Network Traffic Upload

Users can upload a CSV dataset containing network traffic information.

The application validates the uploaded file and extracts sample data for analysis.

Example features may include:

* Packet size
* Connection duration
* Protocol
* Traffic volume
* Flow characteristics
* Other network-related numerical features

---

## 2. Hybrid AI Analysis

The application represents a multi-stage detection workflow:

```text
Upload
   ↓
Preprocessing
   ↓
Supervised Analysis
   ↓
Unsupervised Analysis
   ↓
Hybrid Fusion
   ↓
Explainability
   ↓
Visualization
```

This makes the detection pipeline easier to understand and extend.

---

## 3. Random Forest Simulation

Random Forest represents the **supervised learning component** of the system.

Its role is to classify traffic based on patterns learned from labeled examples.

The conceptual pipeline is:

```text
Network Features
       ↓
Feature Processing
       ↓
Random Forest
       ↓
Classification
       ↓
Threat/Normal Analysis
```

---

## 4. Autoencoder Anomaly Detection

The Autoencoder represents the **unsupervised learning component**.

Instead of relying entirely on predefined attack labels, the approach focuses on identifying traffic that behaves differently from learned patterns.

Conceptually:

```text
Input Features
      ↓
Encoder
      ↓
Latent Representation
      ↓
Decoder
      ↓
Reconstructed Features
      ↓
Reconstruction Error
      ↓
Anomaly Score
```

A higher reconstruction error can indicate that an observation differs from the learned representation.

---

## 5. Explainable AI with SHAP

One of the main goals of the project is to make model decisions easier to interpret.

The dashboard presents feature-level explanations using **SHAP-style feature importance**.

Instead of only showing:

> "Traffic is anomalous."

the system aims to provide information such as:

```text
Anomaly Detected

Important contributing features:
• Packet Size
• Connection Duration
• Traffic Volume
• Protocol Characteristics
```

This provides a more interpretable view of the detection process.

---

## 6. Interactive Results Dashboard

The application provides visual analysis including:

* Accuracy
* Precision
* Recall
* F1 Score
* Confusion Matrix
* ROC Curve
* Feature importance
* SHAP explanations
* Anomaly scores
* Real-time activity

The visualization layer is implemented using **Recharts**.

---

## 7. Real-Time Simulation

The project includes a simulated real-time monitoring mode.

Instead of requiring a live network packet capture system, the application generates traffic observations and continuously updates the dashboard.

Conceptually:

```text
Simulated Traffic Stream
          ↓
       Analysis
          ↓
     Anomaly Score
          ↓
       Threshold
       ↙       ↘
    Normal    Anomaly
       ↓         ↓
   Dashboard   Alert
```

This allows the architecture to demonstrate continuous monitoring without requiring specialized network hardware.

---

## 8. Persistent Analysis History

Previous analysis results can be stored locally using browser **Local Storage**.

This allows users to save and retrieve previous analysis sessions without requiring a backend database.

---

# Application Architecture

```text
┌─────────────────────────────────────────────┐
│                  User                       │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│              React Frontend                 │
│                                             │
│  File Upload → Analysis → Dashboard        │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│            Data Processing Layer             │
│                                             │
│  CSV Parsing → Validation → Feature Sample │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│             AI Analysis Layer               │
│                                             │
│     ┌─────────────┐    ┌─────────────┐      │
│     │Random Forest│    │ Autoencoder │      │
│     │ Supervised  │    │ Unsupervised│      │
│     └──────┬──────┘    └──────┬──────┘      │
│            └─────────┬─────────┘             │
│                      ▼                       │
│               Hybrid Analysis               │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│             Explainability Layer            │
│                                             │
│                  SHAP                       │
│            Feature Importance               │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│             Visualization Layer             │
│                                             │
│ Metrics • Charts • Alerts • SHAP • ROC      │
└─────────────────────────────────────────────┘
```

---

# Project Structure

```text
Hybrid-AI-Anomaly-Detection/
│
├── components/
│   ├── FileUpload.tsx
│   ├── AnalysisStepper.tsx
│   ├── ResultsDashboard.tsx
│   ├── RealtimeDashboard.tsx
│   ├── MetricCard.tsx
│   ├── ConfusionMatrix.tsx
│   ├── RocCurveChart.tsx
│   └── ShapChart.tsx
│
├── services/
│   ├── geminiService.ts
│   └── localStorageService.ts
│
├── utils/
│   └── metrics.ts
│
├── App.tsx
├── index.tsx
├── index.html
├── types.ts
├── vite.config.ts
├── tsconfig.json
├── package.json
├── Project_Report.md
└── README.md
```

The repository currently follows this React/TypeScript structure, with separate components, services, utilities, type definitions, and the project report.

---

# Technology Stack

| Layer           | Technology            |
| --------------- | --------------------- |
| Frontend        | React                 |
| Language        | TypeScript            |
| Build Tool      | Vite                  |
| Styling         | Tailwind CSS          |
| AI Integration  | Google Gemini API     |
| Visualization   | Recharts              |
| Explainability  | SHAP concepts         |
| Storage         | Browser Local Storage |
| Package Manager | npm                   |

The project's report specifies React + TypeScript, Vite, Google Generative AI, Recharts, and Tailwind CSS as the primary technologies.

---

# Getting Started

## Prerequisites

Make sure you have:

* Node.js
* npm
* A Google Gemini API key

---

## 1. Clone the Repository

```bash
git clone https://github.com/pavanvishnu08/Hybrid-AI-Anomaly-Detection.git
```

Navigate into the project:

```bash
cd Hybrid-AI-Anomaly-Detection
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Gemini API

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Do not commit your API key to GitHub.

---

## 4. Start the Development Server

```bash
npm run dev
```

Vite will start the local development server.

Open the URL displayed in your terminal, typically:

```text
http://localhost:5173
```

---

# How the Application Works

### Step 1 — Upload Dataset

The user uploads a network traffic CSV file.

```text
CSV Dataset
     ↓
File Validation
     ↓
Data Preview
```

### Step 2 — Preprocessing

The application reads the uploaded data and prepares a sample for analysis.

### Step 3 — Supervised Analysis

The system represents the Random Forest stage for identifying known traffic patterns.
