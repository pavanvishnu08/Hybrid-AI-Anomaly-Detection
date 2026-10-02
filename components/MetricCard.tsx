
import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center transition-all duration-300 hover:bg-gray-700 hover:border-teal-500">
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">{title}</h3>
      <p className="text-3xl font-bold text-teal-400 mt-1">{value}</p>
    </div>
  );
};
