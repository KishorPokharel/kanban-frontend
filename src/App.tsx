import {
  Text,
  Card,
  CardBody,
  VStack,
  SimpleGrid,
  Input,
} from '@chakra-ui/react';
import Navbar from './Navbar';
import { useEffect, useRef, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { DropResult } from 'react-beautiful-dnd';

interface Board {
  [key: string]: Task[];
}

interface Task {
  id: number;
  content: string;
}

const App = () => {
  const [board, setBoard] = useState<Board>({} as Board);
  const newTaskInputRef = useRef<HTMLInputElement | null>(null);

  const handleOnDragEnd = (result: DropResult) => {
    console.log(result);
    const { draggableId, source, destination } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const newDestination = Array.from(board[destination.droppableId]);
      const [item] = newDestination.splice(source.index, 1);
      newDestination.splice(destination.index, 0, item);
      const newBoard = { ...board };
      newBoard[destination.droppableId] = newDestination;
      setBoard(newBoard);
    } else {
      const newSource = Array.from(board[source.droppableId]);
      const newDestination = Array.from(board[destination.droppableId]);
      const [item] = newSource.splice(source.index, 1);
      newDestination.splice(destination.index, 0, item);
      const newBoard = { ...board };
      newBoard[source.droppableId] = newSource;
      newBoard[destination.droppableId] = newDestination;
      setBoard(newBoard);
    }

    fetch('http://localhost:3000/api/tasks/sort', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer 7DSOEMHZ7GMHATJ67VP3LPSHBE',
      },
      body: JSON.stringify({
        task_id: parseInt(draggableId),
        source_category: source.droppableId,
        source_index: source.index,
        destination_category: destination.droppableId,
        destination_index: destination.index,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        if (source.droppableId === destination.droppableId) {
          const newDestination = Array.from(board[destination.droppableId]);
          const [item] = newDestination.splice(source.index, 1);
          newDestination.splice(destination.index, 0, item);
          const newBoard = { ...board };
          newBoard[destination.droppableId] = newDestination;
          setBoard(newBoard);
        } else {
          const newSource = Array.from(board[source.droppableId]);
          const newDestination = Array.from(board[destination.droppableId]);
          const [item] = newSource.splice(source.index, 1);
          newDestination.splice(destination.index, 0, item);
          const newBoard = { ...board };
          newBoard[source.droppableId] = newSource;
          newBoard[destination.droppableId] = newDestination;
          setBoard(newBoard);
        }
      });
  };

  const handleNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(newTaskInputRef.current?.value);
    fetch('http://localhost:3000/api/tasks', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer 7DSOEMHZ7GMHATJ67VP3LPSHBE',
      },
      body: JSON.stringify({ content: newTaskInputRef.current?.value }),
    })
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.from(board['TODO']);
        arr.push(data.data);
        const newBoard = { ...board };
        newBoard['TODO'] = arr;
        setBoard(newBoard);
      });
  };

  useEffect(() => {
    fetch('http://localhost:3000/api/tasks', {
      headers: {
        Authorization: 'Bearer 7DSOEMHZ7GMHATJ67VP3LPSHBE',
      },
    })
      .then((res) => res.json())
      .then((data) => setBoard(data.data.tasks));
  }, []);

  return (
    <>
      <Navbar></Navbar>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <SimpleGrid columns={4} gap={5} padding={10}>
          {Object.keys(board).map((category) => (
            <Droppable droppableId={category} key={category}>
              {(provided) => (
                <VStack
                  key={category}
                  spacing={5}
                  width="100%"
                  {...provided.droppableProps}
                  ref={provided.innerRef}>
                  <Text>{category}</Text>
                  {board[category].map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id.toString()}
                      index={index}>
                      {(provided) => (
                        <Card
                          key={task.id}
                          width="100%"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}>
                          <CardBody>
                            <Text>{task.content}</Text>
                          </CardBody>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {category === 'TODO' && (
                    <form
                      onSubmit={(e) => {
                        handleNewTask(e);
                      }}>
                      <Input
                        width="100%"
                        ref={newTaskInputRef}
                        type="text"
                        variant="filled"
                        placeholder="Add new Task"></Input>
                    </form>
                  )}
                </VStack>
              )}
            </Droppable>
          ))}
        </SimpleGrid>
      </DragDropContext>
    </>
  );
};

export default App;
