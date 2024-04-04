import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Select,
  SimpleGrid,
  useColorModeValue,
  VStack,
  HStack,
  Badge,
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Td
} from "@chakra-ui/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  PieController,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import Card from "components/card/Card.js"; // Assuming this path is correct

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  PieController
); // Ensure you have installed chart.js and react-chartjs-2

const fetchDataForPieChart = async (period) => {
  const intervalMap = {
    day: "1 DAY",
    month: "1 MONTH",
    year: "1 YEAR",
    all: "100 YEAR",
  };

  const interval = intervalMap[period];
  const sqlQuery = encodeURIComponent(
    `SELECT md.name, COUNT(w.id) AS cycle_count, SUM(md.price) AS total_earnings FROM washing w JOIN mode md ON w.mode_id = md.id WHERE w.start_time >= DATE_SUB(CURRENT_DATE, INTERVAL ${interval}) GROUP BY md.name ORDER BY cycle_count DESC;`
  );
  const url = `http://payments.ala-laundry.com/db?sql=${sqlQuery}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.data; // Assuming the structure based on your provided JSON
  } catch (error) {
    console.error("Error fetching data: ", error);
    return []; // Return an empty array in case of an error
  }
};

export default function Conversion({ data }) {
  const [selectedPeriod, setSelectedPeriod] = useState("day");
  const [pieData, setPieData] = useState([]);
  const textColor = useColorModeValue("gray.700", "white");


  useEffect(() => {
    fetchDataForPieChart(selectedPeriod).then(setPieData);
  }, [selectedPeriod]);

  const tableData = pieData.map((item, index) => (
    <Tr key={index}>
      <Td>
        <Flex align="center">
          <Box w="12px" h="12px" bg="blue.500" borderRadius="full" mr="12px" />
          <Text fontSize="sm" fontWeight="bold" color={textColor}>
            {item.name}
          </Text>
        </Flex>
      </Td>
      <Td isNumeric>{item.cycle_count} cycles</Td>
      <Td isNumeric>₸{item.total_earnings}</Td>
    </Tr>
  ));

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide default legend as we will use a custom one
      },
    },
  };

  const generateColors = (length) => {
    const colors = [];
    for (let i = 0; i < length; i++) {
      colors.push(`hsl(${(i * 360) / length}, 70%, 50%)`);
    }
    return colors;
  };


  const chartData = {
    labels: pieData.map((mode) => mode.name),
    datasets: [
      {
        data: pieData.map((mode) => mode.cycle_count),
        backgroundColor: generateColors(pieData.length),
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box
      pt={{ base: "120px", md: "75px", lg: "30px" }} // Пример адаптивного padding сверху
      px={{ base: "10px", md: "20px", lg: "30px", xl: "40px" }} // Пример адаптивного padding по горизонтали
      bg="white"
      borderRadius="lg"
      boxShadow="md"
      p={5}
    >
      <SimpleGrid columns={1} gap="20px" mb="20px">
        <Box>
          <VStack spacing={5}>
            <Flex justifyContent="space-between">
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Rejımdegi Kirister
              </Text>
              <Select
                onChange={(e) => setSelectedPeriod(e.target.value)}
                width="200px"
                ml="20px"
              >
                <option value="day">Kúndik</option>
                <option value="month">Aılyq</option>
                <option value="year">Jyldyq</option>
                <option value="all">Jalpy</option>
              </Select>
            </Flex>
            <Box>
              <Pie mb="4" data={chartData} options={pieChartOptions} />
            </Box>
          </VStack>
          <Table mt="30px" variant="simple">
            <Thead>
              <Tr>
                <Th>Rejım</Th>
                <Th isNumeric>Jýý sany</Th>
                <Th isNumeric>Tabys</Th>
              </Tr>
            </Thead>
            <Tbody>
              {pieData.map((mode, index) => (
                <Tr key={index}>
                  <Td>{mode.name.split("|")[1].trim()}</Td>
                  <Td isNumeric>{mode.cycle_count}</Td>
                  <Td isNumeric>{mode.total_earnings}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
