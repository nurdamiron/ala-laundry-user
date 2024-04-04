import {
  Box,
  Button,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  Collapse,
  useBreakpointValue,
  useColorModeValue,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import Card from "components/card/Card";
import React, { useState, useEffect } from "react";

const fetchData = async (selectedPeriod) => {
  let whereClause = "";
  switch (selectedPeriod) {
    case "day":
      whereClause = "WHERE w.start_time >= DATE_SUB(NOW(), INTERVAL 1 DAY)";
      break;
    case "month":
      whereClause = "WHERE w.start_time >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
      break;
    case "year":
      whereClause = "WHERE w.start_time >= DATE_SUB(NOW(), INTERVAL 1 YEAR)";
      break;
    default:
      whereClause = ""; // для всего периода не нужно условие
  }

  const sql = `SELECT m.id AS machine_id, m.name AS machine_name, COUNT(w.id) AS wash_count, SUM(md.price) AS total_earnings, r.name AS room_name FROM washing w JOIN machine m ON w.machine_id = m.id JOIN mode md ON w.mode_id = md.id JOIN room r ON m.room_id = r.id ${whereClause} GROUP BY m.id ORDER BY total_earnings DESC;`;

  try {
    const response = await fetch(
      `http://payments.ala-laundry.com/db?sql=${encodeURIComponent(sql)}`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error("There was a problem with the fetch operation: ", error);
    return [];
  }
};

// You should also import some data for the table
export default function MachinePayments(props) {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [machines, setMachines] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("Kúndik");

  useEffect(() => {
    fetchData("all").then((data) => setMachines(data));
  }, []);

  const handlePeriodChange = async (period, label) => {
    setSelectedPeriod(label); // Обновляем состояние для отображения выбранного периода
    const data = await fetchData(period);
    setMachines(data);
  };


  const displayedMachines = isExpanded ? machines : machines.slice(0, 5);

  return (
    <Card>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        mb="4"
        flexDirection={["column", "row"]}
      >
        <Text
          fontSize={["md", "lg"]}
          color={textColor}
          fontWeight="bold"
          mb={[4, 0]}
        >
          Mashına Tabysy
        </Text>
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            fontSize={{ base: "sm", md: "md" }}
            bg={isExpanded ? "blue.500" : "gray.200"} // Задаем цвет фона
            color={isExpanded ? "white" : "black"} // Задаем цвет иконки
            _hover={{ bg: "blue.600", color: "white" }} // Цвет при наведении
            _active={{ bg: "blue.700", color: "white" }} // Цвет при нажатии
          >
            {selectedPeriod}
          </MenuButton>
          <MenuList>
            <MenuItem
              fontSize={{ base: "xs", md: "sm" }}
              onClick={() => handlePeriodChange("day", "Kúndik")}
            >
              Kúndik
            </MenuItem>
            <MenuItem
              fontSize={{ base: "xs", md: "sm" }}
              onClick={() => handlePeriodChange("month", "Aılyq")}
            >
              Aılyq
            </MenuItem>
            <MenuItem
              fontSize={{ base: "xs", md: "sm" }}
              onClick={() => handlePeriodChange("year", "Jyldyq")}
            >
              Jyldyq
            </MenuItem>
            <MenuItem
              fontSize={{ base: "xs", md: "sm" }}
              onClick={() => handlePeriodChange("all", "Barlyq")}
            >
              Barlyq
            </MenuItem>
          </MenuList>
        </Menu>
        <IconButton
          icon={isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Show more or less"
          bg={isExpanded ? "blue.500" : "gray.200"} // Задаем цвет фона
          color={isExpanded ? "white" : "black"} // Задаем цвет иконки
          _hover={{ bg: "blue.600", color: "white" }} // Цвет при наведении
          _active={{ bg: "blue.700", color: "white" }} // Цвет при нажатии
        />
      </Flex>
      <Box overflowX="auto">
        <Table variant="simple" color={textColor} size="sm">
          <Thead>
            <Tr>
              <Th color="gray.400">ID</Th>
              <Th color="gray.400" isNumeric>
                Jýý Sany
              </Th>
              <Th color="gray.400" isNumeric>
                Jalpy Tabys
              </Th>
              {isMobile ? null : <Th color="gray.400">Mashına Ataýy</Th>}
              <Th color="gray.400">Bólme Ataýy</Th>
            </Tr>
          </Thead>
          <Tbody>
            {displayedMachines.map((machine, index) => (
              <Tr key={index}>
                <Td>{machine.machine_id}</Td>
                <Td isNumeric>{machine.wash_count}</Td>
                <Td isNumeric>{machine.total_earnings}</Td>
                {isMobile ? null : <Td>{machine.machine_name}</Td>}
                <Td>{machine.room_name}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
}

