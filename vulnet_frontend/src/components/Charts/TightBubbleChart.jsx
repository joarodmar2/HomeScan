import React from "react";
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    ZAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

const TightBubbleChart = ({ data, width = "100%", height = 400 }) => {
    return (
        <ResponsiveContainer width={width} height={height}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid />
                <XAxis type="number" dataKey="x" name="X" />
                <YAxis type="number" dataKey="y" name="Y" />
                <ZAxis type="number" dataKey="value" range={[100, 1000]} name="Vulnerabilidades" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Estancias" data={data}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || "#3182CE"} />
                    ))}
                </Scatter>
            </ScatterChart>
        </ResponsiveContainer>
    );
};

export default TightBubbleChart;
