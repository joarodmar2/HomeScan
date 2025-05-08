import React from "react";
import ReactApexChart from "react-apexcharts";
import { Box, useColorModeValue } from "@chakra-ui/react";

export default function CompactBubbleChart({ data }) {
    const bg = useColorModeValue("white", "gray.800");

    const series = [
        {
            name: "Vulnerabilidades",
            data: data.map((item, index) => ({
                x: item.label,
                y: 0,
                z: Math.sqrt(item.value) * 10,
                label: item.label,
                value: item.value,
                color: item.color || "#4299E1"
            }))
        }
    ];

    const options = {
        chart: {
            type: "bubble",
            toolbar: { show: false },
            animations: {
                enabled: true,
                easing: "easeinout",
                speed: 500,
                animateGradually: { enabled: true, delay: 150 },
                dynamicAnimation: { enabled: true, speed: 300 }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: (_, opts) => opts.w.config.series[0].data[opts.dataPointIndex].label,
            style: {
                fontWeight: 600,
                colors: ["#fff"]
            },
            background: {
                enabled: false
            }
        },
        xaxis: {
            type: "category",
            tickAmount: 0,
            labels: { show: false },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            max: 1,
            min: -1,
            labels: { show: false },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        tooltip: {
            custom: function ({ w, seriesIndex, dataPointIndex }) {
                const d = w.config.series[seriesIndex].data[dataPointIndex];
                return `<div style="padding: 8px;"><strong>${d.label}</strong><br/>${d.value} vulnerabilidades</div>`;
            }
        },
        plotOptions: {
            bubble: {
                minBubbleRadius: 10,
                maxBubbleRadius: 60
            }
        },
        colors: data.map(d => d.color || "#4299E1")
    };

    return (
        <Box bg={bg} p={6} borderRadius="xl" boxShadow="md" width="100%" height="100%">
            <ReactApexChart options={options} series={series} type="bubble" height={400} />
        </Box>
    );
}
