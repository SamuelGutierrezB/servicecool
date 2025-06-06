import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Parse from "../services/parse";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<Parse.User | null>(null);

  useEffect(() => {
    // Check if user is logged in
    async function checkUser() {
      try {
        const currentUser = await Parse.User.currentAsync();
        setUser(currentUser);
      } catch (error) {
        console.error("Error checking user:", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkUser();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      {!user ? (
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}
