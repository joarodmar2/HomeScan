// src/components/Charts/PolicyBubbleChart.jsx
import React from "react";
import BubbleChart from "../../pages/react-bubble-chart-d3"; // ajusta el path si es necesario

export default function PolicyBubbleChart({ data }) {
    return (
        <BubbleChart
            graph={{ zoom: 1 }}
            width={400}
            height={400}
            data={data}
            valueFont={null}
            labelFont={{
                family: "Arial",
                size: 18,
                color: "#fff",
                weight: "bold"
            }}
            showLegend={false}
            bubbleClickFunc={() => { }}
            legendClickFun={() => { }}
        />
    );
}
