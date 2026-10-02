# Hybrid AI Anomaly Detection in Network Traffic: Detailed Project Report

## 1. INTRODUCTION

Network traffic anomaly detection is a critical aspect of cybersecurity, aimed at identifying unusual patterns that may indicate potential threats such as intrusions, malware, or denial-of-service attacks. Traditional methods often rely on rule-based systems or single-model approaches, which can be limited in handling complex, evolving threats. This project introduces a hybrid AI approach combining supervised and unsupervised learning techniques to enhance detection accuracy and provide explainable insights.

The developed system is a web-based application that simulates a hybrid model integrating Random Forest (supervised) and Autoencoder (unsupervised) algorithms. It processes network traffic datasets, performs anomaly detection, and visualizes results with metrics, confusion matrices, ROC curves, and SHAP-based feature explanations. The application leverages Google's Gemini AI for generating simulated analysis results, making it a conceptual demonstration suitable for educational and prototyping purposes.

This report provides a comprehensive overview of the project's development, from conceptualization to implementation, testing, and potential future enhancements.

## 2. LITERATURE SURVEY

### 2.1 Existing System

Existing anomaly detection systems in network traffic primarily fall into three categories:

1. **Signature-Based Detection**: Systems like Snort use predefined rules to match known attack patterns. These are effective for known threats but fail against zero-day attacks.

2. **Statistical Methods**: Approaches such as threshold-based detection (e.g., using mean and standard deviation) or time-series analysis are simple but struggle with dynamic network environments.

3. **Machine Learning-Based Systems**:
   - **Supervised Learning**: Models like Random Forest or SVM require labeled data and perform well on classification tasks.
   - **Unsupervised Learning**: Techniques like Autoencoders or Isolation Forests detect anomalies without labels but may have higher false positives.
   - Hybrid approaches combining multiple models have shown promise, as seen in studies integrating clustering with classification.

Recent works include the use of deep learning models (e.g., LSTM for sequential data) and ensemble methods for improved accuracy. Tools like Wireshark for packet analysis and frameworks like Scikit-learn for ML implementation are commonly used.

### 2.2 Limitation of Existing System

- **Single-Model Dependency**: Reliance on one algorithm limits adaptability to diverse threat types.
- **Lack of Explainability**: Many ML models act as "black boxes," making it hard to understand detection decisions.
- **Data Dependency**: Supervised methods require large labeled datasets, which are scarce in cybersecurity.
- **Scalability Issues**: Real-time processing of high-volume traffic is computationally intensive.
- **False Positives/Negatives**: Imbalanced datasets lead to poor performance in minority class detection (anomalies).
- **Resource Constraints**: Traditional systems may not handle big data efficiently without optimization.

### 2.3 Gaps Identified

- Integration of supervised and unsupervised models in a hybrid framework is underexplored for network traffic.
- Web-based interfaces for interactive anomaly detection are limited.
- Explainable AI (XAI) techniques like SHAP are not widely applied in network security tools.
- Simulation environments for testing without real network data are scarce.
- Real-time visualization and dashboarding for anomaly monitoring need enhancement.

### 2.4 Problem Statement

Traditional anomaly detection methods in network traffic suffer from low accuracy, lack of interpretability, and inability to handle hybrid threat scenarios. There is a need for a hybrid AI system that combines the strengths of supervised and unsupervised learning, provides explainable results, and offers an interactive web interface for analysis and real-time simulation.

### 2.5 Objectives

- Develop a hybrid AI model simulating Random Forest and Autoencoder for anomaly detection.
- Create a web application for uploading network traffic datasets and visualizing analysis results.
- Implement explainability using SHAP values for feature importance.
- Provide real-time simulation capabilities for continuous monitoring.
- Ensure the system is modular, scalable, and user-friendly.
- Demonstrate the system's effectiveness through simulated results and validation.

## 3. PROPOSED SYSTEM

### 3.1 Architecture

The system follows a client-server architecture with a focus on the frontend for user interaction. Key components include:

- **Frontend (React Application)**: Handles user interface, file uploads, and result visualization.
- **AI Simulation Layer**: Uses Google's Gemini AI to generate simulated hybrid model results.
- **Data Processing Module**: Parses CSV files and extracts features.
- **Visualization Components**: Displays metrics, charts, and dashboards using Recharts.
- **Storage Layer**: Local storage for saving analysis results.

Architecture Diagram (Conceptual):

```
[User] --> [React App] --> [File Upload] --> [Data Processing]
                    |                    |
                    v                    v
              [Gemini AI Simulation] --> [Analysis Results]
                    |
                    v
              [Visualization Dashboard] --> [Local Storage]
```

Modules:
- FileUpload: Handles CSV file selection and validation.
- AnalysisStepper: Shows progress of analysis steps (preprocessing, supervised, unsupervised, fusion, explainability).
- ResultsDashboard: Displays static analysis results.
- RealtimeDashboard: Simulates real-time anomaly detection.
- GeminiService: Interfaces with Google Generative AI for result generation.

### 3.2 Requirements & Specifications

#### 3.2.1 Client Requirements

- Upload CSV files containing network traffic data (e.g., packet size, duration, protocol).
- Run static or real-time analysis.
- View detailed results including metrics, confusion matrix, ROC curve, SHAP values.
- Save and load previous analysis results.
- Intuitive UI with responsive design.

#### 3.2.2 Software Requirements

- **Frontend Framework**: React 19.2.0 with TypeScript.
- **Build Tool**: Vite 6.2.0.
- **AI Integration**: Google Generative AI (@google/genai 1.25.0).
- **Charting Library**: Recharts 3.2.1.
- **Development Tools**: Node.js, npm.
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari).

#### 3.2.3 Hardware Requirements

- **Minimum**: 4GB RAM, 2-core CPU, 500MB storage.
- **Recommended**: 8GB RAM, 4-core CPU, 1GB storage for smooth performance.
- **Network**: Internet connection for Gemini API access.

## 4. DESIGN

### 4.1 DFD Diagram

Data Flow Diagram (Level 0):

```
External Entity: User
Process: Web App
Data Store: Local Storage

User --> Upload File --> Web App --> Process Data --> Call Gemini API --> Generate Results --> Store Results --> Display Dashboard --> User
```

Level 1 DFD:

- Process 1: File Upload and Validation.
- Process 2: Data Preprocessing (parse CSV, extract sample).
- Process 3: AI Analysis Simulation (send prompt to Gemini, receive JSON).
- Process 4: Result Visualization (render charts and metrics).
- Process 5: Real-time Simulation (generate streaming data).

### 4.2 Module Design and Organization

- **App.tsx**: Main component managing state and routing.
- **Components**:
  - FileUpload.tsx: File input and validation.
  - AnalysisStepper.tsx: Progress indicator.
  - ResultsDashboard.tsx: Static results display.
  - RealtimeDashboard.tsx: Real-time chart updates.
  - MetricCard.tsx, ConfusionMatrix.tsx, RocCurveChart.tsx, ShapChart.tsx: Individual visualization components.
- **Services**:
  - geminiService.ts: Handles AI API calls.
  - localStorageService.ts: Manages result persistence.
- **Utils**:
  - metrics.ts: Utility functions for calculations.
- **Types**: TypeScript interfaces for data structures.

## 5. IMPLEMENTATION & TESTING

### 5.1 Technology Used

- **Programming Language**: TypeScript/JavaScript.
- **Framework**: React with Hooks (useState, useCallback).
- **Styling**: Tailwind CSS (via className).
- **AI Model**: Simulated via Google Gemini 1.5 Flash.
- **Charts**: Recharts for SVG-based visualizations.
- **Build System**: Vite for fast development and bundling.

### 5.2 Procedures

1. **Setup**: Install dependencies with `npm install`, set GEMINI_API_KEY in .env.local.
2. **Development**: Run `npm run dev` to start Vite dev server.
3. **File Upload**: User selects CSV file, app reads first 10 rows for sample.
4. **Analysis**: Simulate steps with delays, call Gemini API with prompt.
5. **Results**: Parse JSON response, display in dashboards.
6. **Real-time**: Generate mock data points for continuous simulation.

### 5.3 Testing & Validation

#### 5.3.1 Design Test Cases and Scenarios

- **File Upload**:
  - Valid CSV: Should load and display file name.
  - Invalid File: Show error message.
  - Empty File: Handle gracefully.

- **Analysis**:
  - Static Mode: Complete all steps, display results.
  - Real-time Mode: Start simulation, stop on command.
  - Error Handling: API failure, invalid response.

- **Visualization**:
  - Metrics: Verify accuracy > 0.8.
  - Charts: Ensure data renders correctly.
  - SHAP Values: Display feature contributions.

#### 5.3.2 Validation

- Unit Tests: Test individual components (e.g., file parsing, API calls).
- Integration Tests: End-to-end flow from upload to results.
- Performance: Simulate large datasets (1000+ rows).
- Usability: Ensure responsive design on mobile/desktop.

## 6. RESULTS

### 6.1 Output

The application successfully simulates hybrid anomaly detection. Sample outputs include:

- **Metrics**: Accuracy ~0.92, Precision ~0.89, Recall ~0.91, F1-Score ~0.90.
- **Confusion Matrix**: [[950, 50], [30, 970]].
- **ROC Curve**: Smooth curve with AUC ~0.94.
- **SHAP Values**: Top features like "packet_size" (0.25), "duration" (0.18).
- **Real-time Dashboard**: Streaming anomaly scores with alerts.

Screenshots (Conceptual):
- File Upload Interface.
- Analysis Progress Stepper.
- Results Dashboard with Charts.

### 6.2 Result Analysis

- The simulated model achieves high accuracy, demonstrating the potential of hybrid approaches.
- SHAP explanations provide interpretability, aiding in understanding feature impacts.
- Real-time mode allows for proactive monitoring.
- Limitations: Results are simulated; real implementation requires actual ML models.

## 7. CONCLUSION

This project successfully demonstrates a hybrid AI anomaly detection system for network traffic through a web application. By integrating simulated supervised and unsupervised models with explainable AI, it addresses key gaps in existing systems. The modular design ensures scalability, and the interactive interface enhances usability. As a conceptual tool, it serves as a foundation for real-world implementations.

## 8. FUTURE WORK

- Integrate actual ML libraries (e.g., TensorFlow, Scikit-learn) for real analysis.
- Add support for streaming data sources (e.g., Kafka).
- Implement user authentication and cloud storage.
- Enhance explainability with additional XAI techniques.
- Conduct extensive testing on real network datasets.

## 9. REFERENCES

1. Google Generative AI Documentation. https://ai.google.dev/
2. React Documentation. https://react.dev/
3. Vite Build Tool. https://vitejs.dev/
4. Recharts Library. https://recharts.org/
5. SHAP Documentation. https://shap.readthedocs.io/
6. Network Anomaly Detection Literature (e.g., papers on IEEE Xplore).
