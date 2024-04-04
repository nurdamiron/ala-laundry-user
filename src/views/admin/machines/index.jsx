import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Circle,
  Select,
  Center,
} from "@chakra-ui/react";


export default function Machines() {
  const [machines, setMachines] = useState([]);
  const [availableModes, setAvailableModes] = useState([]); // Это объявление должно быть здесь
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen, // Используйте onEditOpen для открытия модального окна редактирования
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isStartOpen,
    onOpen: onStartOpen, // Используйте onStartOpen для открытия модального окна запуска
    onClose: onStartClose,
  } = useDisclosure();
  const [selectedMachine, setSelectedMachine] = useState(null);

  const fetchMachinesData = async () => {
    const sqlQuery = encodeURIComponent(`SELECT m.id AS machine_id, m.name AS machine_name, r.name AS room_name, w.state AS machine_state, 
    SUBSTRING_INDEX(SUBSTRING_INDEX(md.name, ' | ', -1), ' - ', 1) AS mode_name FROM machine m JOIN room r ON m.room_id = r.id
    LEFT JOIN (SELECT *, ROW_NUMBER() OVER (PARTITION BY machine_id ORDER BY start_time DESC) as rn FROM washing) w ON m.id = w.machine_id AND w.rn = 1
    LEFT JOIN mode md ON w.mode_id = md.id;
  `);
    const url = `http://payments.ala-laundry.com/db?sql=${sqlQuery}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.data; // Возвращаем массив данных о последних статусах машин
  };
  
  const fetchAvailableModes = async () => {
    try {
      const response = await fetch('http://payments.ala-laundry.com/db?sql=SELECT * FROM mode;');
      const data = await response.json();
      if (response.ok && data.data) { // Убедитесь, что data.data существует
        const modes = data.data.map(mode => ({
          id: mode.id,
          name: mode.name.split(' | ')[1], // Используйте вторую часть названия режима
          price: mode.price,
          duration: mode.duration
        }));
        setAvailableModes(modes);
      } else {
        // Это может быть ошибка сервера или data.data не существует
        throw new Error(data.message || "Ошибка в данных или ответе сервера.");
      }
    } catch (error) {
      console.error("Ошибка при получении доступных режимов: ", error);
    }
  };
  
  


  const getStatusIcon = (status) => {
    const colorScheme = {
      available: 'green',
      active: 'red',
      'non available': 'gray',
    };
    return <Circle size="15px" bg={colorScheme[status.toLowerCase()]} />;
  };

  

  const openEditModal = (machine) => {
    setSelectedMachine(machine);
    onEditOpen(); // Исправлено на onEditOpen
  };

  const handleMachineControl = (machine, action) => {
    setSelectedMachine(machine);
    if (action === 'start') {
      onStartOpen();
    } else if (action === 'stop') {
      // TODO: добавить логику обработки остановки стирки
      console.log(`Stopping machine with ID: ${machine.machine_id}`);
    }
  };

  useEffect(() => {
    fetchMachinesData().then(data => setMachines(data)).catch(error => console.error(error));
    fetchAvailableModes().then(data => setAvailableModes(data)).catch(error => console.error(error));
  }, []);

  // Функции для добавления, редактирования и удаления машин (не показаны)

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap="20px">
        {machines.map((machine) => (
          <Flex key={machine.machine_id} p={5} shadow="md" borderWidth="1px" direction="column" alignItems="start">
            <Text fontWeight="bold">ID: {machine.machine_id}</Text>
            <Text>Статус: {getStatusIcon(machine.machine_state)}</Text>
            {machine.machine_state.toLowerCase() === 'available' ? (
              <Button colorScheme="green" onClick={() => handleMachineControl(machine, 'start')}>
                Включить
              </Button>
            ) : (
              <Button colorScheme="red" onClick={() => handleMachineControl(machine, 'stop')}>
                Отключить
              </Button>
            )}
          </Flex>
        ))}
      </SimpleGrid>

      {/* Модальное окно для запуска стирки */}
      <Modal isOpen={isStartOpen} onClose={onStartClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Запуск стирки</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center my={4}>
              <Text fontSize="xl">ID стиралки: {selectedMachine?.machine_id}</Text>
            </Center>
            <Select placeholder="Выберите режим" mb={4}>
              {availableModes.map((mode) => (
                <option key={mode.id} value={mode.id}>{mode.name}</option>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onStartClose}>Включить</Button>
            <Button onClick={onStartClose}>Отмена</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
