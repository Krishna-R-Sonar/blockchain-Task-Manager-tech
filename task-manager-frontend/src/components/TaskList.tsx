/* blockchain-task-manager/task-manager-frontend/src/components/TaskList.tsx */
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FaCheck, FaEdit, FaTrash } from "react-icons/fa";
import { useBlockchain } from "../contexts/BlockchainContext";

const EditForm = ({
  task,
  onSave,
  onCancel,
}: {
  task: {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    owner: string;
  };
  onSave: (id: number, title: string, description: string) => void;
  onCancel: () => void;
}) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  return (
    <Flex direction="column" gap={2}>
      <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      <Input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Flex gap={2}>
        <Button size="sm" onClick={() => onSave(task.id, title, description)}>
          Save
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </Flex>
    </Flex>
  );
};

const TaskList = () => {
  const { contract, currentAccount } = useBlockchain();
  const [tasks, setTasks] = useState<
    {
      id: number;
      title: string;
      description: string;
      completed: boolean;
      owner: string;
    }[]
  >([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const toast = useToast();

  const fetchTasks = async () => {
    if (!contract || !currentAccount) return;

    try {
      const taskIds = await contract.getUserTaskIds(currentAccount);
      const fetchedTasks = await Promise.all(
        taskIds.map(async (id: bigint) => {
          const taskArray = await contract.tasks(id);
          return {
            id: Number(taskArray[0]),
            title: taskArray[1],
            description: taskArray[2],
            completed: taskArray[3],
            owner: taskArray[4],
          };
        })
      );
      setTasks(
        fetchedTasks.filter(
          (t) => t.owner.toLowerCase() === currentAccount.toLowerCase()
        )
      );
    } catch (error: any) {
      console.error("Error fetching tasks:", error);
      toast({
        title: "Error fetching tasks",
        description: error.message || "An unknown error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [contract, currentAccount]);

  useEffect(() => {
    if (currentAccount) {
      const interval = setInterval(fetchTasks, 5000);
      return () => clearInterval(interval);
    }
  }, [currentAccount]);

  const handleAddTask = async () => {
    if (!contract || !newTask.title || !newTask.description) {
      toast({
        title: "Invalid input",
        description: "Please provide a title and description",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const tx = await contract.addTask(newTask.title, newTask.description);
      await tx.wait();
      setNewTask({ title: "", description: "" });
      await fetchTasks();
      toast({
        title: "Task added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      const errorMessage =
        error.data?.message || error.message || "An unknown error occurred";
      toast({
        title: "Error adding task",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleComplete = async (taskId: number) => {
    if (!contract) return;

    try {
      const tx = await contract.markCompleted(taskId);
      await tx.wait();
      await fetchTasks();
      toast({
        title: "Task marked as completed",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      const errorMessage =
        error.data?.message || error.message || "An unknown error occurred";
      toast({
        title: "Error completing task",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEdit = async (
    taskId: number,
    title: string,
    description: string
  ) => {
    if (!contract || !title || !description) {
      toast({
        title: "Invalid input",
        description: "Please provide a title and description",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const tx = await contract.editTask(taskId, title, description);
      await tx.wait();
      setEditingTask(null);
      await fetchTasks();
      toast({
        title: "Task updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      const errorMessage =
        error.data?.message || error.message || "An unknown error occurred";
      toast({
        title: "Error updating task",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (taskId: number) => {
    if (!contract) return;

    try {
      const tx = await contract.deleteTask(taskId);
      await tx.wait();
      await fetchTasks();
      toast({
        title: "Task deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      const errorMessage =
        error.data?.message || error.message || "An unknown error occurred";
      toast({
        title: "Error deleting task",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4} maxW="800px" mx="auto">
      <Heading mb={6}>Blockchain Task Manager</Heading>

      <Flex gap={2} mb={8}>
        <Input
          placeholder="Task title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <Input
          placeholder="Task description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />
        <Button
          onClick={handleAddTask}
          colorScheme="blue"
          fontSize="md"
          px={5}
          flexShrink={0}
          whiteSpace="nowrap"
          minW="120px"
        >
          Add Task
        </Button>
      </Flex>

      {tasks.length === 0 ? (
        <Text>No tasks found. Add a task to get started!</Text>
      ) : (
        tasks.map((task) => (
          <Card key={task.id} p={4} mb={3}>
            <Flex justify="space-between" align="center">
              <Box flex={1}>
                {editingTask === task.id ? (
                  <EditForm
                    task={task}
                    onSave={handleEdit}
                    onCancel={() => setEditingTask(null)}
                  />
                ) : (
                  <>
                    <Heading size="md">{task.title}</Heading>
                    <Text>{task.description}</Text>
                    <Text color={task.completed ? "green.500" : "gray.500"}>
                      {task.completed ? "Completed" : "Pending"}
                    </Text>
                  </>
                )}
              </Box>
              <Flex gap={2}>
                <Button
                  onClick={() => handleComplete(task.id)}
                  isDisabled={task.completed}
                >
                  <FaCheck color={task.completed ? "green" : "gray"} />
                </Button>
                <Button onClick={() => setEditingTask(task.id)}>
                  <FaEdit />
                </Button>
                <Button onClick={() => handleDelete(task.id)} colorScheme="red">
                  <FaTrash />
                </Button>
              </Flex>
            </Flex>
          </Card>
        ))
      )}
    </Box>
  );
};

export default TaskList;