// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import LineChart from "components/charts/LineChart";
import React, { useEffect, useState } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { MdBarChart, MdOutlineCalendarToday } from "react-icons/md";
// Assets
import { RiArrowUpSFill } from "react-icons/ri";
import { FaCaretDown } from "react-icons/fa6";

import {
  lineChartDataTotalSpent,
  lineChartOptionsTotalSpent,
} from "variables/charts";

export default function TotalSpent(props) {
  const { ...rest } = props;

  // Chakra Color Mode

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("secondaryBlue.100", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const iconColor = useColorModeValue("brand.500", "white");
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.400" },
    { bg: "whiteAlpha.50" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.100" }
  );

  const [currentMonthSpent, setCurrentMonthSpent] = useState(null);
  const [previousMonthSpent, setPreviousMonthSpent] = useState(null);
  const [percentChange, setPercentChange] = useState(null);

  const calculatePercentChange = (current, previous) => {
    if (previous && previous !== 0) {
      return (((current - previous) / previous) * 100).toFixed(2);
    }
    return null;
  };

  const fetchPaymentData = async (month) => {
    let intervalQuery = "";
    if (month === "current") {
      intervalQuery =
        " WHERE washing.start_time >= DATE_SUB(NOW(), INTERVAL 1 MONTH) AND washing.start_time < NOW()";
    } else if (month === "previous") {
      intervalQuery =
        " WHERE washing.start_time >= DATE_SUB(NOW(), INTERVAL 2 MONTH) AND washing.start_time < DATE_SUB(NOW(), INTERVAL 1 MONTH)";
    }

    try {
      const response = await fetch(
        `http://payments.ala-laundry.com/db?sql=SELECT SUM(payment.sum) AS totalSum FROM payment JOIN washing ON payment.id = washing.id${intervalQuery};`
      );
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      const result = await response.json();
console.log('Result:', result);
return result.totalSum;
    } catch (error) {
      console.error("Ошибка при получении данных о платежах:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const currentData = await fetchPaymentData("current");
      const previousData = await fetchPaymentData("previous");
      setCurrentMonthSpent(currentData);
      setPreviousMonthSpent(previousData);
      const change = calculatePercentChange(currentData, previousData);
      setPercentChange(change);
    };

    fetchData();
  }, []);
 
  // ... JSX компонента ...

  return (
    <Card
      justifyContent="center"
      align="center"
      direction="column"
      w="100%"
      mb="0px"
      {...rest}
    >
      <Flex justify="space-between" ps="0px" pe="20px" pt="5px">
        <Flex align="center" w="100%">
          <Button
            bg={boxBg}
            fontSize="md"
            fontWeight="700"
            color={textColorSecondary}
            borderRadius="7px"
          >
            Aılyq kórsetkishter
          </Button>
          <Button
            ms="auto"
            align="center"
            justifyContent="center"
            bg={bgButton}
            _hover={bgHover}
            _focus={bgFocus}
            _active={bgFocus}
            w="37px"
            h="37px"
            lineHeight="100%"
            borderRadius="10px"
            {...rest}
          >
            <Icon as={MdBarChart} color={iconColor} w="24px" h="24px" />
          </Button>
        </Flex>
      </Flex>
      <Flex w="100%" flexDirection={{ base: "column", lg: "row" }}>
        <Flex flexDirection="column" me="20px" mt="28px">
          <Text
            color={textColor}
            fontSize="34px"
            textAlign="start"
            fontWeight="700"
            lineHeight="100%"
          >
            ₸{" "}
            {currentMonthSpent
              ? currentMonthSpent.toLocaleString()
              : "Загрузка..."}
          </Text>
          <Flex align="center" mb="10px">
            <Text
              color={percentChange >= 0 ? "green.500" : "red.500"}
              fontSize="sm"
              fontWeight="700"
            >
              {percentChange}%
            </Text>
            {percentChange !== null && (
              <Flex align="center">
                <Icon
                  as={percentChange >= 0 ? RiArrowUpSFill : FaCaretDown}
                  color={percentChange >= 0 ? "green.500" : "red.500"}
                  me="2px"
                  mt="0px"
                />
                <Text
                  color={percentChange >= 0 ? "green.500" : "red.500"}
                  fontSize="sm"
                  fontWeight="700"
                >
                  {percentChange}%
                </Text>
              </Flex>
            )}
          </Flex>
        </Flex>
        <Box minH="260px" minW="75%" mt="auto">
          <LineChart
            chartData={lineChartDataTotalSpent}
            chartOptions={lineChartOptionsTotalSpent}
          />
        </Box>
      </Flex>
    </Card>
  );
}
