import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

// Chakra imports
import { Box, Flex, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


export default function EarningsLineChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const sqlQuery = encodeURIComponent(`...`); // Use the SQL query provided above
      const url = `http://payments.ala-laundry.com/db?sql=${sqlQuery}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const { data } = await response.json();
        setChartData({
          labels: data.map((d) => d.month_name),
          datasets: [
            {
              label: "Total Earnings",
              data: data.map((d) => d.total_earnings),
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              tension: 0.1,
            },
            {
              label: "Total Cycles",
              data: data.map((d) => d.total_cycles),
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              tension: 0.1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box
      pt={{ base: "130px", md: "80px", xl: "80px" }}
      px={{ base: "10px", md: "20px", lg: "30px", xl: "40px" }}
      bg={useColorModeValue("white", "gray.800")}
      borderRadius="lg"
      boxShadow="lg"
      p={5}
    >
      <Flex justifyContent="space-between" align="center" mb={4}>
      </Flex>
      <Line data={chartData} />
    </Box>
  );
}