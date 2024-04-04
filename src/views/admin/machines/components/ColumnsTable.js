import {
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

// Custom components
import Card from "components/card/Card";
import Menu from "components/menu/MainMenu";
export default function ColumnsTable(props) {
  const { columnsData, tableData } = props;

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    initialState,
  } = tableInstance;
  initialState.pageSize = 5;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  return (
    <Card
      direction="column"
      w="100%"
      px="0px"
      overflowX={{ sm: "scroll", lg: "hidden" }}
    >
      <Flex px="25px" justify="space-between" mb="20px" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          4 - Column Table
        </Text>
        <Menu />
      </Flex>
      <Table variant="simple" color="gray.500" mb="24px">
        <Thead>
          <Tr>
            <Th pe="10px" borderColor={borderColor}>
              <Flex
                justify="space-between"
                align="center"
                fontSize={{ sm: "10px", lg: "12px" }}
                color="gray.400"
              ></Flex>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Flex align="center">
              <Text color={textColor} fontSize="sm" fontWeight="700">
                header
              </Text>
            </Flex>
            <Flex align="center">
              <Text me="10px" color={textColor} fontSize="sm" fontWeight="700">
                HEADER
              </Text>
            </Flex>
            <Flex align="center">
              <Text me="10px" color={textColor} fontSize="sm" fontWeight="700">
                header
              </Text>
            </Flex>
            <Text color={textColor} fontSize="sm" fontWeight="700">
              HEADER
            </Text>
            <Text color={textColor} fontSize="sm" fontWeight="700"></Text>
            <Td
              fontSize={{ sm: "14px" }}
              minW={{ sm: "150px", md: "200px", lg: "auto" }}
              borderColor="transparent"
            ></Td>
          </Tr>
        </Tbody>
      </Table>
    </Card>
  );
}
