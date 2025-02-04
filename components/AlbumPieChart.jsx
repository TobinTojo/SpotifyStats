import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AlbumPieChart = ({ data, selectedArtist }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Process data to group tracks by album (existing code remains the same)
  const processAlbumData = (tracks) => {
    const albumMap = new Map();
    
    tracks?.forEach(track => {
      // Check if it's a single or feature
      const isSingleOrFeature = track.album?.album_type === 'single' || 
                                track.artists[0].name != selectedArtist;
      
      const albumName = isSingleOrFeature ? 'Other' : track.album?.name || 'Other';
      albumMap.set(albumName, (albumMap.get(albumName) || 0) + 1);
    });

    return Array.from(albumMap, ([name, count]) => ({ name, count }));
  };

  const albumData = processAlbumData(data);

  // Expanded color palette with Spotify-inspired colors
  const COLORS = [
    '#1DB954', '#1ED760', '#4CAF50', '#81C784', 
    '#A5D6A7', '#C8E6C9', '#E8F5E9', '#FF6B6B',
    '#FFA07A', '#FFD700', '#87CEEB', '#6A5ACD',
    '#FF69B4', '#00CED1', '#FF8C00', '#7B68EE'
  ];

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
      <PieChart>
        <Pie
          data={albumData}
          dataKey="count"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={isMobile ? 80 : 120}
          innerRadius={isMobile ? 40 : 60}
          paddingAngle={2}
          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
        {albumData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]} 
              stroke="#2a2a2a"
              strokeWidth={2}
            />
          ))}

        </Pie>
        <Tooltip 
          contentStyle={{
            backgroundColor: '#2a2a2a',
            border: '1px solid #1DB954',
            borderRadius: '8px',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}
          formatter={(value, name) => [`${value} tracks`, name]}
        />

        <Legend 
          layout={isMobile ? 'horizontal' : 'vertical'} 
          verticalAlign={isMobile ? 'bottom' : 'middle'}
          align="center"
          wrapperStyle={{ 
            color: '#fff', 
            paddingTop: isMobile ? '10px' : '20px',
            fontSize: isMobile ? '12px' : '14px',
          }}
          iconSize={isMobile ? 12 : 16}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default AlbumPieChart;