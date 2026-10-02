
import React from 'react';
import type { ConfusionMatrixData } from '../types';

interface ConfusionMatrixProps {
  data: ConfusionMatrixData;
}

export const ConfusionMatrix: React.FC<ConfusionMatrixProps> = ({ data }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <div className="relative grid grid-cols-3 grid-rows-3 gap-1 text-center font-mono">
        <div className="p-2"></div>
        <div className="p-2 font-bold text-teal-400">Predicted Normal</div>
        <div className="p-2 font-bold text-orange-400">Predicted Anomaly</div>

        <div className="p-2 font-bold text-teal-400 transform -rotate-90 origin-center self-center">Actual Normal</div>
        <div className="bg-green-800/50 p-4 rounded-md">
          <div className="text-sm text-green-300">True Negative</div>
          <div className="text-2xl font-bold text-white">{data.trueNegative.toLocaleString()}</div>
        </div>
        <div className="bg-red-800/50 p-4 rounded-md">
          <div className="text-sm text-red-300">False Positive</div>
          <div className="text-2xl font-bold text-white">{data.falsePositive.toLocaleString()}</div>
        </div>

        <div className="p-2 font-bold text-orange-400 transform -rotate-90 origin-center self-center">Actual Anomaly</div>
        <div className="bg-orange-800/50 p-4 rounded-md">
          <div className="text-sm text-orange-300">False Negative</div>
          <div className="text-2xl font-bold text-white">{data.falseNegative.toLocaleString()}</div>
        </div>
        <div className="bg-green-800/50 p-4 rounded-md">
          <div className="text-sm text-green-300">True Positive</div>
          <div className="text-2xl font-bold text-white">{data.truePositive.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};
