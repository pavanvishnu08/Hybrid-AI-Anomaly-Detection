import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import type { FeatureImportance } from '../types';

interface ShapChartProps {
  data: FeatureImportance[];
}

export const ShapChart: React.FC<ShapChartProps> = ({ data }) => {
  // Reverse data for correct horizontal bar chart display
  const processedData = [...data].reverse();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={processedData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis type="number" stroke="#9ca3af" />
        <YAxis 
          type="category" 
          dataKey="feature" 
          stroke="#9ca3af" 
          width={150} 
          tick={{ fontSize: 12 }} 
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1f2937',
            border: '1px solid #4b5563',
            color: '#e5e7eb'
          }}
          cursor={{ fill: '#374151' }}
        />
        <Bar dataKey="importance" fill="#14b8a6" background={{ fill: '#374151' }}>
           <LabelList dataKey="importance" position="right" formatter={(value: number) => value.toFixed(4)} style={{ fill: '#d1d5db', fontSize: 12 }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
