'use client'

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    Cell
} from 'recharts';

const data = [
    { name: '1월', issues: 40, resolved: 24 },
    { name: '2월', issues: 30, resolved: 13 },
    { name: '3월', issues: 20, resolved: 38 },
    { name: '4월', issues: 27, resolved: 39 },
    { name: '5월', issues: 18, resolved: 48 },
    { name: '6월', issues: 23, resolved: 38 },
    { name: '7월', issues: 34, resolved: 43 },
];

export function QualityTrendChart() {
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorIssues" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#007AFF" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#007AFF" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5EA" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#8E8E93' }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#8E8E93' }}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="issues"
                        stroke="#007AFF"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorIssues)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

const severityData = [
    { name: 'S (치명)', count: 4, color: '#FF3B30' },
    { name: 'A (중대)', count: 7, color: '#FF9500' },
    { name: 'B (일반)', count: 12, color: '#FFCC00' },
    { name: 'C (경미)', count: 18, color: '#34C759' },
];

export function SeverityDistribution() {
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={severityData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis
                        dataKey="name"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 13, fontWeight: 500, fill: '#1C1C1E' }}
                        width={80}
                    />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                        {severityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
