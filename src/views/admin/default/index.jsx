import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
  Button,
  
} from "@chakra-ui/react";

import MiniCalendar from "components/calendar/MiniCalendar";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React, { useState, useEffect } from "react";
import MachinePayments from "views/admin/default/components/MachinePayments";
import RoomPayments from "views/admin/default/components/RoomPayments";
import PieCard from "views/admin/default/components/PieCard";
import { PiMoney } from "react-icons/pi";
import { RiLoopRightFill } from "react-icons/ri";

const fetchData = async (interval, setData) => {
  const intervalQuery =
    interval !== "all"
      ? ` WHERE start_time >= DATE_SUB(NOW(), INTERVAL 1 ${interval.toUpperCase()})`
      : "";
  try {
    const [washingRes, paymentRes] = await Promise.all([
      fetch(
        `http://payments.ala-laundry.com/db?sql=SELECT COUNT(*) as count FROM washing${intervalQuery};`
      ),
      fetch(
        `http://payments.ala-laundry.com/db?sql=SELECT SUM(sum) as total FROM payment JOIN washing ON payment.id = washing.id${intervalQuery};`
      ),
    ]);

    if (!washingRes.ok || !paymentRes.ok) {
      throw new Error(`Network response was not ok.`);
    }

    const washingData = await washingRes.json();
    const paymentData = await paymentRes.json();

    setData({
      washingCount: washingData?.data?.[0]?.count || 0, // Check for existence of each property
      paymentSum: paymentData?.data?.[0]?.total || 0, // Use optional chaining to avoid errors
    });
  } catch (error) {
    console.error("Error fetching data: ", error);
    setData({ washingCount: 0, paymentSum: 0 }); // Reset data on error
  }
};

export default function MainDashboard() {
  const brandColor = useColorModeValue("brand.500", "white");
  const [statistics, setStatistics] = useState({
    washingCount: 0,
    paymentSum: 0,
  });
  const [selectedInterval, setSelectedInterval] = useState("day");

  useEffect(() => {
    fetchData(selectedInterval, setStatistics);
  }, [selectedInterval]);

  return (
    <Box
      pt={{ base: "130px", md: "80px", xl: "80px" }}
      px={{ base: "10px", md: "20px" }}
    >
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap="20px"
        mb="20px"
      >
        <Flex mt="3px">
          <Select
            variant="filled"
            background="gray.200"
            value={selectedInterval}
            onChange={(e) => setSelectedInterval(e.target.value)}
          >
            <option value="day">Kúndik</option>
            <option value="month">Aılyq</option>
            <option value="year">Jyldyq</option>
            <option value="all">Jalpy</option>
          </Select>
        </Flex>
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
              icon={<Icon w="28px" h="28px" as={PiMoney} color="white" />}
            />
          }
          name="Kiris" // Название статистики
          value={
            statistics.paymentSum ? `₸ ${statistics.paymentSum}` : "Загрузка..."
          }
        />
        {/* Компонент для отображения количества стирок за выбранный интервал времени */}
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
              icon={
                <Icon w="28px" h="28px" as={RiLoopRightFill} color="white" />
              }
            />
          }
          endContent={
            <Flex me="-12px" mt="0px">
              {/* Выпадающий список для выбора интервала времени */}
            </Flex>
          }
          name="Jalpy Jýý sany" // Название статистики
          value={
            statistics.washingCount
              ? `${statistics.washingCount}`
              : "Загрузка..."
          }
        />
      </SimpleGrid>{" "}
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
        <MachinePayments />
        <RoomPayments />{" "}
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
          {/* <DailyTraffic /> */}
          <PieCard />
        </SimpleGrid>{" "}
      </SimpleGrid>{" "}
    </Box>
  );
}
