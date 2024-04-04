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

  const sql = `SELECT r.id AS room_id, r.name AS room_name, COUNT(DISTINCT m.id) AS machine_count, COUNT(w.id) AS wash_count, SUM(md.price) AS total_earnings FROM room r JOIN machine m ON m.room_id = r.id JOIN washing w ON w.machine_id = m.id JOIN mode md ON w.mode_id = md.id ${whereClause} GROUP BY r.id ORDER BY total_earnings DESC;`;

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
export default function RoomPayments(props) {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [room, setRoom] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("Kúndik");

  useEffect(() => {
    fetchData("all").then((data) => setRoom(data));
  }, []);

  const handlePeriodChange = async (period, label) => {
    setSelectedPeriod(label); // Обновляем состояние для отображения выбранного периода
    const data = await fetchData(period);
    setRoom(data);
  };

  const displayedRoom = isExpanded ? room : room.slice(0, 5);

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
          Bólme Tabysy
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
              <Th color="gray.400">Bólme Ataýy</Th>
              <Th color="gray.400" isNumeric>
                M Sany
              </Th>
              <Th color="gray.400" isNumeric>
                Jýý Sany
              </Th>
              <Th color="gray.400" isNumeric>
                Jalpy Tabys
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {displayedRoom.map((room, index) => (
              <Tr key={index}>
                <Td>{room.room_name}</Td>
                <Td isNumeric>{room.machine_count}</Td>
                <Td isNumeric>{room.wash_count}</Td>
                <Td isNumeric>{room.total_earnings}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
}
