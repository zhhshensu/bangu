import { Flex, Icon, Link, FlexProps } from "@chakra-ui/react";
import { IconType } from "react-icons";
import {
  Link as RouterLink,
  createFileRoute,
  redirect,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";

interface NavItemProps extends FlexProps {
  icon: IconType;
  path: string;
  children?: React.ReactNode;
}

export const NavItem: React.FC<NavItemProps> = ({ path, icon, children, ...rest }) => {
  // 使用 try-catch 来处理未定义的路由
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // 使用 try-catch 来处理未定义的路由
    try {
      const currentPath = location.pathname;
      const targetPath = path;
      setIsActive(currentPath === targetPath);
    } catch (error) {
      console.error("Error occurred:", error);
    }
  }, [location, path]);

  return (
    <Link
      as={RouterLink}
      to={path}
      _focus={{
        bg: "transparent",
        color: "white",
      }}
    >
      <Flex
        align="center"
        w="100%"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? "cyan.400" : "transparent"}
        color={isActive ? "white" : "inherit"}
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
            asChild={false}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};
