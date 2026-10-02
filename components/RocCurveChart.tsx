import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label, AreaChart, Area } from 'recharts';
import type { RocPoint } from '../types';

interface RocCurveChartProps {
  data: RocPoint[];
}

export const RocCurveChart: React.FC<RocCurveChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 5,
          right: 20,
          left: 20,
          bottom: 20,
        }}
      >
        <defs>
            <linearGradient id="colorRoc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
            </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
            type="number"
            dataKey="fpr"
            domain={[0, 1]}
            stroke="#9ca3af"
            tick={{ fontSize: 12 }}
        >
            <Label value="False Positive Rate" offset={-15} position="insideBottom" fill="#9ca3af" />
        </XAxis>
        <YAxis 
            stroke="#9ca3af" 
            tick={{ fontSize: 12 }}
            domain={[0, 1]}
        >
            <Label value="True Positive Rate" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: '#9ca3af' }} />
        </YAxis>
        <Tooltip
          contentStyle={{
            backgroundColor: '#1f2937',
            border: '1px solid #4b5563',
            color: '#e5e7eb'
          }}
          labelFormatter={(value) => `FPR: ${Number(value).toFixed(3)}`}
          formatter={(value: number, name: string) => [value.toFixed(3), 'TPR']}
        />
        <Line 
            type="monotone" 
            dataKey="tpr"
            stroke="#14b8a6"
            strokeWidth={2}
            dot={false}
        />
        {/* FIX: The `stroke` prop for Area expects a color string. Use "none" to disable the stroke. */}
        <Area type="monotone" dataKey="tpr" stroke="none" fill="url(#colorRoc)" />
        <Line 
            strokeDasharray="5 5"
            dataKey={(d) => d.fpr}
            stroke="#6b7280"
            dot={false}
            strokeWidth={1}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};