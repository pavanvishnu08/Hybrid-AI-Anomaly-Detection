import React, { useState, useEffect, useMemo } from 'react';
import type { AnalysisResult, RealtimeDataPoint, ConfusionMatrixData, PerformanceMetrics } from '../types';
import { MetricCard } from './MetricCard';
import { ConfusionMatrix } from './ConfusionMatrix';
import { ShapChart } from './ShapChart';
import { RealtimeChart } from './RealtimeChart';
import { PlayIcon, PauseIcon, StopIcon } from './icons/Icons';

interface RealtimeDashboardProps {
  initialResult: AnalysisResult;
  onStop: () => void;
}

const calculateLiveMetrics = (cm: ConfusionMatrixData): PerformanceMetrics => {
  const { truePositive, falsePositive, falseNegative, trueNegative } = cm;
  const total = truePositive + falsePositive + falseNegative + trueNegative;

  const accuracy = total > 0 ? (truePositive + trueNegative) / total : 0;
  const precision = (truePositive + falsePositive) > 0 ? truePositive / (truePositive + falsePositive) : 0;
  const recall = (truePositive + falseNegative) > 0 ? truePositive / (truePositive + falseNegative) : 0;
  const f1Score = (precision + recall) > 0 ? (2 * precision * recall) / (precision + recall) : 0;
  
  // Simplified ROC-AUC for live view
  const tpr = recall;
  const fpr = (falsePositive) / (falsePositive + trueNegative) || 0;
  const rocAuc = (tpr - fpr + 1) / 2; // Approximation

  return { 
    accuracy, 
    precision, 
    recall, 
    f1Score, 
    rocAuc: isNaN(rocAuc) ? 0 : rocAuc 
  };
};

export const RealtimeDashboard: React.FC<RealtimeDashboardProps> = ({ initialResult, onStop }) => {
  const [isRunning, setIsRunning] = useState(true);
  const [simulationData, setSimulationData] = useState(initialResult);
  const [chartData, setChartData] = useState<RealtimeDataPoint[]>([]);
  const [time, setTime] = useState(0);
  const [totalPackets, setTotalPackets] = useState(0);
  const [totalAnomalies, setTotalAnomalies] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTime(prev => prev + 1);
      
      const newPackets = Math.floor(Math.random() * 200) + 100; // Simulate more traffic
      let newAnomaliesInTick = 0;
      
      const newConfusionMatrix: ConfusionMatrixData = { ...simulationData.confusionMatrix };

      // Use model's recall and precision to simulate predictions
      const truePositiveRate = simulationData.metrics.recall;
      const falsePositiveRate = simulationData.metrics.precision > 0 
        ? (simulationData.metrics.recall / simulationData.metrics.precision) * (1 - simulationData.metrics.accuracy) / simulationData.metrics.accuracy
        : 0.01;

      for (let i = 0; i < newPackets; i++) {
        const isActuallyAnomaly = Math.random() < (initialResult.anomalyPercentage / 100);
        let isPredictedAnomaly = false;

        if (isActuallyAnomaly) {
          isPredictedAnomaly = Math.random() < truePositiveRate; // Model's ability to catch real anomalies
          if (isPredictedAnomaly) {
            newConfusionMatrix.truePositive++;
          } else {
            newConfusionMatrix.falseNegative++;
          }
        } else { // Packet is actually normal
          isPredictedAnomaly = Math.random() < falsePositiveRate; // Model's tendency to make mistakes on normal data
          if (isPredictedAnomaly) {
            newConfusionMatrix.falsePositive++;
          } else {
            newConfusionMatrix.trueNegative++;
          }
        }
        if(isPredictedAnomaly) newAnomaliesInTick++;
      }

      const newMetrics: PerformanceMetrics = calculateLiveMetrics(newConfusionMatrix);
      const detectedAnomalies = newConfusionMatrix.truePositive + newConfusionMatrix.falsePositive;

      setTotalPackets(prev => prev + newPackets);
      setTotalAnomalies(detectedAnomalies);

      setSimulationData(prev => ({
        ...prev,
        confusionMatrix: newConfusionMatrix,
        metrics: newMetrics,
      }));

      setChartData(prev => [...prev.slice(-59), { time, anomalies: newAnomaliesInTick }]);

    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, time, initialResult, simulationData]);

  const currentAnomalyRate = useMemo(() => (
    totalPackets > 0 ? (totalAnomalies / totalPackets) * 100 : 0
  ), [totalPackets, totalAnomalies]);

  return (
    <div className="mt-8 space-y-8 animate-fade-in text-left">
      {/* Header and Controls */}
      <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
            <h2 className="text-xl font-bold text-white">Live Simulation</h2>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => setIsRunning(!isRunning)} className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded-md transition-colors" aria-label={isRunning ? 'Pause simulation' : 'Resume simulation'}>
                {isRunning ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
            </button>
            <button onClick={onStop} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition-colors" aria-label="Stop simulation">
                <StopIcon className="w-5 h-5" />
            </button>
        </div>
      </div>
      
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Packets Processed</h3>
                <p className="text-3xl font-bold text-teal-400 mt-1" aria-live="polite">{totalPackets.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Anomalies Detected (TP+FP)</h3>
                <p className="text-3xl font-bold text-orange-400 mt-1" aria-live="polite">{totalAnomalies.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Current Detection Rate</h3>
                <p className="text-3xl font-bold text-teal-400 mt-1" aria-live="polite">{currentAnomalyRate.toFixed(2)}%</p>
            </div>
       </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Anomalies Detected Over Time</h2>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 h-72">
            <RealtimeChart data={chartData} />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Live Performance Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <MetricCard title="Accuracy" value={simulationData.metrics.accuracy.toFixed(3)} />
          <MetricCard title="Precision" value={simulationData.metrics.precision.toFixed(3)} />
          <MetricCard title="Recall" value={simulationData.metrics.recall.toFixed(3)} />
          <MetricCard title="F1-Score" value={simulationData.metrics.f1Score.toFixed(3)} />
          <MetricCard title="ROC-AUC" value={simulationData.metrics.rocAuc.toFixed(3)} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Live Confusion Matrix</h2>
          <ConfusionMatrix data={simulationData.confusionMatrix} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">SHAP Feature Importance</h2>
           <p className="text-sm text-gray-400 mb-4">Based on initial model training. Does not change during simulation.</p>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 h-96">
            <ShapChart data={initialResult.featureImportances} />
          </div>
        </div>
      </div>
    </div>
  );
};
