
import React, { useState, useEffect } from 'react';

import {
  Box,
  Button,
  Flex,
  Grid,

  Text,
  useColorModeValue,
  SimpleGrid,
} from "@chakra-ui/react";

import Room from "components/card/Room";
import Card from 'components/card/Card.js'; // Убедитесь, что путь к Card корректен
import { Link } from 'react-router-dom'; // Для маршрутизации внутри приложения

const fetchRoomsData = async () => {
  const response = await fetch(
    `http://payments.ala-laundry.com/db?sql=SELECT room.name AS room_name, room.address, COUNT(machine.id) AS machine_count FROM room LEFT JOIN machine ON room.id = machine.room_id GROUP BY room.id;`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data.data; // Возвращаем массив данных о комнатах
};

export default function Rooms() {
  // Chakra Color Mode
   const [rooms, setRooms] = useState([]);
   const textColor = useColorModeValue("secondaryGray.900", "white");

   useEffect(() => {
     fetchRoomsData()
       .then((data) => {
         setRooms(data); // Предполагаем, что data - это массив объектов комнат
       })
       .catch((error) => {
         console.error("Failed to fetch room data:", error);
       });
   }, []); 

   
  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <Grid
        mb="20px"
        gridTemplateColumns={{ xl: "repeat(3, 1fr)", "2xl": "1fr 0.46fr" }}
        gap={{ base: "20px", xl: "20px" }}
        display={{ base: "block", xl: "grid" }}
      >
        <Flex
          flexDirection="column"
          gridArea={{ xl: "1 / 1 / 2 / 3", "2xl": "1 / 1 / 2 / 2" }}
        >
          <Flex direction="column">
            <SimpleGrid columns={{ base: 1, md: 3 }} gap="20px">
              {rooms.map((room, index) => (
                <Card key={index}>
                  <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                    {room.room_name}
                  </Text>
                  <Text>{room.address}</Text>
                  <Text fontSize="xl" fontWeight="bold">
                    Mashina sany: {room.machine_count}
                  </Text>
                  <Flex justify="flex-end">
                    {" "}
                    {/* Выравнивание кнопки справа */}
                    <Link to={`admin/rooms/${room.id}`}>
                      <Button colorScheme="blue">Kiru</Button>
                    </Link>
                  </Flex>
                </Card>
              ))}
            </SimpleGrid>
          </Flex>
        </Flex>
      </Grid>
    </Box>
  );
}
