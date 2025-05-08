import { Box, useColorModeValue } from "@chakra-ui/react";
import ReactApexChart from "react-apexcharts";

export default function StackedBarChart({ series, categories }) {
    const bg = useColorModeValue("white", "gray.800");

    const options = {
        chart: {
            type: "bar",
            stacked: true,
            toolbar: { show: false },
        },
        xaxis: {
            categories,
            labels: { style: { colors: "#718096" } },
        },
        yaxis: {
            title: { text: "Vulnerabilidades" },
            labels: { style: { colors: "#718096" } },
        },
        tooltip: {
            shared: true,
            intersect: false,
            y: {
                formatter: (val) => `${val} vulnerabilidades`,
            },
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: false,
            },
        },
        legend: {
            position: "bottom",
            labels: { colors: "#4A5568" },
        },
        fill: {
            opacity: 1,
        },
        colors: ["#63B3ED", "#ED8936", "#F6AD55", "#E53E3E", "#9F7AEA"],
    };

    return (
        <Box
            bg={bg}
            p={6}
            borderRadius="xl"
            boxShadow="md"
            width="100%"
            height="100%"
        >
            <ReactApexChart options={options} series={series} type="bar" height={400} />
        </Box>
    );
}
