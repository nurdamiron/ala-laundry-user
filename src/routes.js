import React from "react";

import { Icon } from "@chakra-ui/react";
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
} from "react-icons/md";

// Admin Imports
import MainDashboard from "views/admin/default";
import Rooms from "views/admin/rooms";
import Profile from "views/admin/profile";
import Machines from "views/admin/machines";
import RTL from "views/admin/rtl";
import { TbWashMachine } from "react-icons/tb";
import { IoHomeOutline } from "react-icons/io5";

// Auth Imports
import SignInCentered from "views/auth/signIn";

const routes = [
  {
    name: "Basty Bet",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={IoHomeOutline} width='20px' height='20px' color='inherit' />,
    component: MainDashboard,
  },
  {
    name: "Bolmeler Tizimi",
    layout: "/admin",
    path: "/rooms",
    icon: (
      <Icon
        as={TbWashMachine}
        width='20px'
        height='20px'
        color='inherit'
      />
    ),
    component: Rooms,
    secondary: true,
  },
  {
    name: "Mashinalar tizimi",
    layout: "/admin",
    icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
    path: "/machines",
    component: Machines,
  },
];

export default routes;
