import React from "react";
import { Redirect, SplashScreen, Stack } from "expo-router";
import { useAuth } from "@/store/authStore";

SplashScreen.preventAutoHideAsync();

export default function ProtectedLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      {/* Add other protected screens here */}
    </Stack>
  );
}
