import React from "react";
import { View, Text, Button } from "react-native";
import MMKVStorage from "@/utils/storage";
import { useFetchUserQuery, useLogoutMutation } from "@/api/authApi";

export default function Home() {
  const { data: profileData } = useFetchUserQuery();
  const logoutMutation: any = useLogoutMutation();

  const handleLogout = () => logoutMutation.mutate();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 10,
      }}
    >
      <Text>Welcome to the Home Screen! {profileData?.data?.fullName}</Text>
      <Text>Welcome to the Home Screen! {profileData?.data?.email}</Text>
      <Text>Access Token: {MMKVStorage.getItem("token")}</Text>
      <Text>Refresh Token: {MMKVStorage.getItem("refreshToken")}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
