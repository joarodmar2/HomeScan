import React from "react";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const BubbleChart = ({ data, width = "100%", height = 400 }) => {
    return (
        <ResponsiveContainer width={width} height={height}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid />
                <XAxis type="category" dataKey="label" name="Estancia" />
                <YAxis type="number" dataKey="value" name="Vulnerabilidades" />
                <ZAxis type="number" dataKey="size" range={[100, 1000]} name="Tamaño" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Estancias" data={data} fill="#3182CE" />
            </ScatterChart>
        </ResponsiveContainer>
    );
};

export default BubbleChart;
