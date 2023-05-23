import { HStack, Link, Text } from '@chakra-ui/react';

const Navbar = () => {
  return (
    <HStack paddingX={10} paddingY={3} justify="space-between" align="center">
      <Text fontSize="2xl">Kanban App</Text>
      <HStack justify="end" spacing={10}>
        <Text>Kishor Pokharel</Text>
        <Link color="teal.500" href="/logout">
          Logout
        </Link>
      </HStack>
    </HStack>
  );
};

export default Navbar;
