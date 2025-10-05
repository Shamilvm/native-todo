import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import MainPage from "./pages/MainPage";

export default function App() {
  const isDarkMode = useColorScheme() === "dark";
  return (
    <View style={{ flex: 1 }}>
      <MainPage />
    </View>
  );
}
