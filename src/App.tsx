import {
  Text,
  Card,
  CardBody,
  VStack,
  SimpleGrid,
  Input,
} from '@chakra-ui/react';
import data from './data/board';
import Navbar from './Navbar';

interface Board {
  [key: string]: Task[];
}
interface Task {
  id: number;
  content: string;
}

const App = () => {
  const board = data as Board;
  return (
    <>
      <Navbar></Navbar>
      <SimpleGrid columns={4} gap={5} padding={10}>
        {Object.keys(board).map((category) => (
          <VStack key={category} spacing={5} width="100%">
            <Text>{category}</Text>
            {board[category].map((task) => (
              <Card key={task.id} width="100%">
                <CardBody>
                  <Text>{task.content}</Text>
                </CardBody>
              </Card>
            ))}
            {category === 'TODO' && (
              <Input
                type="text"
                variant="filled"
                placeholder="Add new Task"></Input>
            )}
          </VStack>
        ))}
      </SimpleGrid>
    </>
  );
};

export default App;
