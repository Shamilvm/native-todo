import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
} from "react-native";
import { modalStyles, styles } from "../styles";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

const TodoAddModal = ({
  visible,
  onClose,
  onSave,
  isEdit,
  title,
  setTitle,
  dueDate,
  setDueDate,
  description,
  setDescription,
}: any) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split("T")[0];
      setDueDate(formatted);
    }
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.modalContainer}>
        <View style={modalStyles.modalContent}>
          <Text style={modalStyles.modalTitle}>
            {isEdit ? "Edit Todo" : "New Todo"}
          </Text>

          <ScrollView>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter todo title"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter description (optional)"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.label}>Due Date (YYYY-MM-DD)</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.input}
            >
              <Text>{dueDate ? dueDate : "Select due date"}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dueDate ? new Date(dueDate) : new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
              />
            )}
          </ScrollView>

          <View style={modalStyles.modalButtons}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.button, modalStyles.cancelButton]}
            >
              <Text style={modalStyles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSave}
              style={[styles.button, modalStyles.saveButton]}
            >
              <Text style={modalStyles.saveButtonText}>
                {isEdit ? "Update" : "Add"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TodoAddModal;
