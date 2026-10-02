import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import type { RealtimeDataPoint } from '../types';

interface RealtimeChartProps {
  data: RealtimeDataPoint[];
}

export const RealtimeChart: React.FC<RealtimeChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 0,
          bottom: 5,
        }}
      >
        <defs>
            <linearGradient id="colorAnomalies" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
            </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
            dataKey="time" 
            stroke="#9ca3af" 
            tick={{ fontSize: 12 }}
            label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
        />
        <YAxis 
            stroke="#9ca3af" 
            tick={{ fontSize: 12 }} 
            allowDecimals={false}
            label={{ value: 'Anomalies', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1f2937',
            border: '1px solid #4b5563',
            color: '#e5e7eb'
          }}
          labelFormatter={(label) => `Time: ${label}s`}
        />
        <Area type="monotone" dataKey="anomalies" stroke="#14b8a6" fillOpacity={1} fill="url(#colorAnomalies)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
};