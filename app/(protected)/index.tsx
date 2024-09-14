import React from "react";
import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import { useAuth, useAuthStore } from "@/store/authStore";

export default function Home() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome to the Home Screen!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
