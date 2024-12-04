import { Flex, Spinner } from "@chakra-ui/react";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { Box, useDisclosure } from "@chakra-ui/react";
import { Sidebar } from "@/renderer/components/Sidebar";
// import UserMenu from "../components/Common/UserMenu";
// import useAuth, { isLoggedIn } from "../hooks/useAuth"

export const Route = createFileRoute("/_layout")({
  component: Layout,
  beforeLoad: async () => {
    // if (!isLoggedIn()) {
    //   throw redirect({
    //     to: "/login",
    //   });
    // }
  },
});

function Layout() {
  return (
    <Flex maxW="full" h="auto" position="relative" justify="space-between">
      <Sidebar display={{ base: "block", md: "block" }} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {/* 主要内容区域 */}
        <Box p="4" borderRadius="lg" bg="white">
          <Outlet />
        </Box>
      </Box>
      {/* <UserMenu /> */}
    </Flex>
  );
}
