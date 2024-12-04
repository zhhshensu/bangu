import { Box, BoxProps, Button, IconButton, Flex, Icon, Text, VStack } from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiLogOut,
  FiLogIn,
} from "react-icons/fi";
import React from "react";
import { NavItem } from "./Navitem";

interface SidebarProps extends BoxProps {}

interface LinkItemProps {
  name: string;
  path: string;
  icon: any;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "首页", icon: FiHome, path: "/" },
  { name: "趋势", icon: FiTrendingUp, path: "/admin" },
  { name: "发现", icon: FiCompass, path: "/profile" },
  { name: "收藏", icon: FiStar, path: "/user" },
  { name: "设置", icon: FiSettings, path: "/settings" },
];

export const Sidebar = ({ ...rest }: SidebarProps) => {
  const isLoggedIn = false; // 这里替换为你的登录状态
  return (
    <Box
      as="nav"
      borderRight="1px"
      bg="white"
      position="fixed"
      top="0"
      left="0"
      w="240px"
      h="full"
      {...rest}
    >
      {/* Logo区域 */}
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text>
        <Button display={{ base: "flex", md: "none" }} />
      </Flex>
      {/* 导航菜单 */}
      <VStack spacing={2} align="stretch">
        {LinkItems.map((link) => (
          <NavItem key={link.name} icon={link.icon} path={link.path}>
            {link.name}
          </NavItem>
        ))}
      </VStack>
      {/* 底部登录/登出按钮 */}
      <Box position="absolute" bottom="5" width="100%" px="4">
        <IconButton
          width="100%"
          colorScheme={isLoggedIn ? "red" : "blue"}
          variant="outline"
          onClick={() => {
            // 处理登录/登出逻辑
          }}
        >
          {isLoggedIn ? <FiLogOut /> : <FiLogIn />}
        </IconButton>
      </Box>
    </Box>
  );
};
