import AsyncStorage from '@react-native-async-storage/async-storage';
import { TodoType } from '../types';

const TODOS_KEY = '@todos';

export const StorageService = {
  // Load todos from AsyncStorage
  loadTodos: async (): Promise<TodoType[]> => {
    try {
      const storedTodos = await AsyncStorage.getItem(TODOS_KEY);
      if (storedTodos) {
        return JSON.parse(storedTodos);
      }
      return [];
    } catch (error) {
      console.error('Error loading todos:', error);
      return [];
    }
  },

  // Save todos to AsyncStorage
  saveTodos: async (todos: TodoType[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(TODOS_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  },

  // Clear all todos (for testing)
  clearTodos: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(TODOS_KEY);
    } catch (error) {
      console.error('Error clearing todos:', error);
    }
  },
};