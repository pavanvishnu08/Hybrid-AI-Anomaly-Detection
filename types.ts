export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface ConfusionMatrixData {
  truePositive: number;
  falsePositive: number;
  falseNegative: number;
  trueNegative: number;
}

export interface PerformanceMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
}

export interface RocPoint {
  fpr: number; // False Positive Rate
  tpr: number; // True Positive Rate
}

export interface AnalysisResult {
  summary: string;
  anomalyPercentage: number;
  confusionMatrix: ConfusionMatrixData;
  metrics: PerformanceMetrics;
  featureImportances: FeatureImportance[];
  rocCurveData: RocPoint[];
}

export interface RealtimeDataPoint {
  time: number;
  anomalies: number;
}

// This type is no longer used for a live model but kept for potential future use or type safety.
export interface TrainedModelNode {
  featureIndex?: number;
  threshold?: number;
  left?: TrainedModelNode;
  right?: TrainedModelNode;
  value?: number;
  gini?: number;
  numSamples?: number;
}
