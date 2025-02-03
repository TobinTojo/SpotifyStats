import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ArtistSongChart = ({ data }) => {
  console.log("Chart Data:", data);
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis 
          dataKey="timeFrame" 
          tick={{ fill: '#fff' }} 
          axisLine={{ stroke: '#fff' }} 
        />
        <YAxis 
          tick={{ fill: '#fff' }} 
          axisLine={{ stroke: '#fff' }} 
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#2a2a2a',
            border: '1px solid #1DB954',
            borderRadius: '8px',
            color: '#fff',
          }}
        />
        <Legend 
          wrapperStyle={{ color: '#fff', paddingTop: '10px' }} 
        />
        <Bar 
          dataKey="songCount" 
          fill="url(#barGradient)" 
          radius={[5, 5, 0, 0]} 
        />
        {/* Define a gradient for the bars */}
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1DB954" />
            <stop offset="100%" stopColor="#0f7a3d" />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ArtistSongChart;