import AsyncStorage from "@react-native-async-storage/async-storage";
import { TodoType } from "../types";

const STORAGE_KEY = "@todos";

export const StorageService = {
  async getTodos(): Promise<TodoType[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error("Error loading todos:", error);
      return [];
    }
  },

  async saveTodos(todos: TodoType[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(todos);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (error) {
      console.error("Error saving todos:", error);
    }
  },
};
