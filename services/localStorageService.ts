import type { AnalysisResult } from '../types';

const getKey = (file: File): string => {
  return `analysisResult-${file.name}-${file.size}`;
};

export const saveAnalysisResult = (file: File, result: AnalysisResult): void => {
  try {
    const key = getKey(file);
    localStorage.setItem(key, JSON.stringify(result));
    console.log(`Analysis saved for ${file.name}`);
  } catch (error) {
    console.error("Failed to save analysis to localStorage:", error);
  }
};

export const getAnalysisResult = (file: File): AnalysisResult | null => {
  try {
    const key = getKey(file);
    const savedData = localStorage.getItem(key);
    if (savedData) {
      return JSON.parse(savedData) as AnalysisResult;
    }
    return null;
  } catch (error) {
    console.error("Failed to retrieve analysis from localStorage:", error);
    return null;
  }
};

export const clearAnalysisResult = (file: File): void => {
  try {
    const key = getKey(file);
    localStorage.removeItem(key);
    console.log(`Cleared saved analysis for ${file.name}`);
  } catch (error) {
    console.error("Failed to clear analysis from localStorage:", error);
  }
};