import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

// This is a placeholder for the actual API key, which should be
// handled by the environment configuration.
const API_KEY = process.env.API_KEY as string;

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: "A 2-3 sentence summary of the model's performance and findings, referencing the provided data sample." },
    anomalyPercentage: { type: Type.NUMBER, description: "The percentage of anomalies found in the dataset. e.g., 12.5" },
    confusionMatrix: {
      type: Type.OBJECT,
      properties: {
        truePositive: { type: Type.INTEGER },
        falsePositive: { type: Type.INTEGER },
        falseNegative: { type: Type.INTEGER },
        trueNegative: { type: Type.INTEGER },
      },
      required: ["truePositive", "falsePositive", "falseNegative", "trueNegative"],
    },
    metrics: {
      type: Type.OBJECT,
      properties: {
        accuracy: { type: Type.NUMBER },
        precision: { type: Type.NUMBER },
        recall: { type: Type.NUMBER },
        f1Score: { type: Type.NUMBER },
        rocAuc: { type: Type.NUMBER },
      },
      required: ["accuracy", "precision", "recall", "f1Score", "rocAuc"],
    },
    featureImportances: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          feature: { type: Type.STRING },
          importance: { type: Type.NUMBER },
        },
        required: ["feature", "importance"],
      },
      description: "Top 10 most important features identified by SHAP, sorted in descending order of importance. This should be influenced by the data sample provided.",
    },
    rocCurveData: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          fpr: { type: Type.NUMBER, description: "False Positive Rate" },
          tpr: { type: Type.NUMBER, description: "True Positive Rate" },
        },
        required: ["fpr", "tpr"],
      },
      description: "An array of 20-30 points to plot the ROC curve, starting at [0,0] and ending near [1,1]."
    }
  },
  required: ["summary", "anomalyPercentage", "confusionMatrix", "metrics", "featureImportances", "rocCurveData"],
};

const getPrompt = (headers: string[], dataSample: string) => `
  You are a world-class cybersecurity data scientist. Your task is to analyze a dataset of network traffic flow features to detect anomalies.
  
  The dataset has the following features: ${headers.join(', ')}.

  Here is a small sample of the data (the first 10 rows) to give you context on the data distribution and values:
  """
  ${dataSample}
  """

  Use this sample to inform your simulation, making the results more realistic and specific to the provided data. For example, if you see certain features have consistently high or low values, they might be more important in the SHAP analysis. Base your summary on observations from this sample.

  Follow this exact pipeline:
  1.  **Preprocessing:** Assume you have handled missing values and normalized numerical features. The labels are encoded (0 for Normal, 1 for Anomaly).
  2.  **Hybrid Model Training:** Using the CIC-IDS2017 dataset from kaggle as the training data:
      a.  **Supervised Model:** Train a Random Forest classifier.
      b.  **Unsupervised Model:** Train a deep Autoencoder using TensorFlow/Keras to learn the normal patterns in the data.
  3.  **Model Fusion:** Combine the predictions from the Random Forest and the reconstruction error from the Autoencoder using an averaging fusion rule to get a final prediction for each data point.
  4.  **Evaluation:** Evaluate the hybrid model on a held-out test set. Calculate the following metrics: Accuracy, Precision, Recall, F1-Score, and ROC-AUC. Also, generate the full confusion matrix (TP, FP, FN, TN). Create a list of 25 (FPR, TPR) coordinates to plot the ROC curve. The curve must start at (0,0) and generally move towards (1,1).
  5.  **Interpretability:** Use the SHAP (SHapley Additive exPlanations) library to determine the top 10 most influential features that the hybrid model uses to distinguish anomalies from normal traffic.

  Generate a JSON object that strictly adheres to the provided schema. Ensure all numerical values are numbers, not strings. The feature importances must be sorted from most important to least. The ROC curve data should represent a plausible, well-behaved curve. Make the results realistic for a high-performing cybersecurity model on a dataset like CIC-IDS2017, but tailored to the provided data sample.
`;

export const runModelAnalysis = async (headers: string[], dataSample: string): Promise<AnalysisResult> => {
  if (!API_KEY) {
    throw new Error("API_KEY is not configured.");
  }

  try {
    const prompt = getPrompt(headers, dataSample);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText) as AnalysisResult;

    // Data validation and cleaning
    if (!result.rocCurveData || !Array.isArray(result.rocCurveData)) {
      result.rocCurveData = [{fpr: 0, tpr: 0}, {fpr: 1, tpr: 1}];
    }
    // Ensure the ROC curve starts at 0,0 for a clean plot
    if (result.rocCurveData[0]?.fpr !== 0 || result.rocCurveData[0]?.tpr !== 0) {
      result.rocCurveData.unshift({ fpr: 0, tpr: 0 });
    }

    return result;
  } catch (error) {
    console.error("Error calling Generative AI:", error);
    throw new Error("Failed to get analysis from the AI model. Please check the API key and model configuration.");
  }
};