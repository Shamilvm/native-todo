import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, FlatList } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TodoType } from "../types";
import { styles } from "../styles";
import TodoAddModal from "../components/TodoAddModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MainPage() {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTodo, setCurrentTodo] = useState<TodoType | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (todos.length > 0) {
      saveTodos();
    }
  }, [todos]);

  const loadTodos = async () => {
    try {
      const stored = await AsyncStorage.getItem("@todos");
      if (stored) {
        setTodos(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading todos:", error);
    }
  };

  const saveTodos = async () => {
    try {
      await AsyncStorage.setItem("@todos", JSON.stringify(todos));
    } catch (error) {
      console.error("Error saving todos:", error);
    }
  };

  const toggleComplete = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setCurrentTodo(null);
  };

  const addTodo = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }

    const newTodo: TodoType = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      isCompleted: false,
      dueDate,
      createdAt: new Date().toISOString(),
      order: todos.length,
    };

    setTodos([...todos, newTodo]);
    resetForm();
    setModalVisible(false);
  };

  const isOverdue = (dueDate: string, isCompleted: boolean) => {
    if (!dueDate || isCompleted) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View>
        <Text style={styles.headerTitle}>My Todos</Text>
        <Text style={styles.headerSubtitle}>
          {todos.filter((t) => !t.isCompleted).length} active tasks
        </Text>
      </View>

      {todos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No todos yet!</Text>
          <Text style={styles.emptySubtext}>Tap + to add your first task</Text>
        </View>
      ) : (
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const overdue = isOverdue(item.dueDate, item.isCompleted);
            return (
              <View
                style={[styles.todoItem, overdue && styles.todoItemOverdue]}
              >
                <View style={styles.todoHeader}>
                  <TouchableOpacity
                    onPress={() => toggleComplete(item.id)}
                    style={[
                      styles.checkbox,
                      item.isCompleted && styles.checkboxCompleted,
                    ]}
                  >
                    {item.isCompleted && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                  <View style={styles.todoContent}>
                    <Text
                      style={[
                        styles.todoTitle,
                        item.isCompleted && styles.todoTitleCompleted,
                      ]}
                    >
                      {item.title}
                    </Text>
                    {item.description && (
                      <Text
                        style={[
                          styles.todoDescription,
                          item.isCompleted && styles.todoDescriptionCompleted,
                        ]}
                      >
                        {item.description}
                      </Text>
                    )}
                    {item.dueDate && (
                      <View style={styles.dueDateContainer}>
                        <Text
                          style={[
                            styles.dueDate,
                            overdue && styles.dueDateOverdue,
                          ]}
                        >
                          📅 Due: {new Date(item.dueDate).toLocaleDateString()}
                        </Text>
                        {overdue && (
                          <Text style={styles.overdueWarning}>⚠️ OVERDUE!</Text>
                        )}
                      </View>
                    )}
                  </View>
                </View>
                <View style={styles.todoActions}>
                  <TouchableOpacity
                    // onPress={() => openEditModal(item)}
                    style={styles.editButton}
                  >
                    <Text>✏️ Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    // onPress={() => deleteTodo(item.id)}
                    style={styles.deleteButton}
                  >
                    <Text>🗑️ Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
          contentContainerStyle={styles.listContent}
        />
        // <></>
      )}

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.plusBtn}
      >
        <Text style={styles.plusBtnText}>+</Text>
      </TouchableOpacity>

      <TodoAddModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          resetForm();
        }}
        onSave={addTodo}
        isEdit={false}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        dueDate={dueDate}
        setDueDate={setDueDate}
      />
    </GestureHandlerRootView>
  );
}
