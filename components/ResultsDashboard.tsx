import React from 'react';
import type { AnalysisResult } from '../types';
import { MetricCard } from './MetricCard';
import { ConfusionMatrix } from './ConfusionMatrix';
import { ShapChart } from './ShapChart';
import { RocCurveChart } from './RocCurveChart';
import { AlertTriangleIcon, InfoIcon } from './icons/Icons';

interface ResultsDashboardProps {
  result: AnalysisResult;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result }) => {
  const { summary, anomalyPercentage, metrics, confusionMatrix, featureImportances, rocCurveData } = result;
  
  return (
    <div className="mt-8 space-y-8 animate-fade-in text-left">
      {/* Summary Section */}
      <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
        <h2 className="text-2xl font-bold text-white mb-4">Hybrid Model Analysis Summary</h2>
        <div className={`flex items-start p-4 rounded-md ${anomalyPercentage > 10 ? 'bg-orange-900/50 border-orange-700' : 'bg-teal-900/50 border-teal-700'} border`}>
          {anomalyPercentage > 10 ? <AlertTriangleIcon className="w-10 h-10 text-orange-400 mr-4 flex-shrink-0" /> : <InfoIcon className="w-10 h-10 text-teal-400 mr-4 flex-shrink-0" />}
          <div>
            <p className="text-3xl font-bold">
              <span className={`${anomalyPercentage > 10 ? 'text-orange-300' : 'text-teal-300'}`}>{anomalyPercentage.toFixed(2)}%</span> Anomaly Rate
            </p>
            <p className="text-gray-300 mt-1">{summary}</p>
          </div>
        </div>
      </div>

      {/* Performance Metrics Section */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <MetricCard title="Accuracy" value={metrics.accuracy.toFixed(3)} />
          <MetricCard title="Precision" value={metrics.precision.toFixed(3)} />
          <MetricCard title="Recall" value={metrics.recall.toFixed(3)} />
          <MetricCard title="F1-Score" value={metrics.f1Score.toFixed(3)} />
          <MetricCard title="ROC-AUC" value={metrics.rocAuc.toFixed(3)} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Confusion Matrix Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Confusion Matrix</h2>
          <ConfusionMatrix data={confusionMatrix} />
        </div>
        {/* ROC Curve Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">ROC Curve</h2>
           <p className="text-sm text-gray-400 mb-4">Visualizes the trade-off between True Positive Rate and False Positive Rate.</p>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 h-[21.5rem]">
            <RocCurveChart data={rocCurveData} />
          </div>
        </div>
      </div>
      
      {/* Feature Importance Section */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">SHAP Feature Importance</h2>
        <p className="text-sm text-gray-400 mb-4">Top 10 features contributing to anomaly detection, based on the hybrid model's SHAP analysis.</p>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 h-96">
          <ShapChart data={featureImportances} />
        </div>
      </div>
    </div>
  );
};
