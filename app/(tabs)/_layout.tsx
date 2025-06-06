import { Redirect, Tabs } from "expo-router";
import { Button } from "react-native";
import Parse from "../../services/parse";

export default function TabLayout() {
  const user = Parse.User.current();

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  const handleLogout = async () => {
    await Parse.User.logOut();
  };

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          headerRight: () => <Button title="Logout" onPress={handleLogout} />,
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          title: "Mis Tickets",
          headerRight: () => <Button title="Logout" onPress={handleLogout} />,
        }}
      />
    </Tabs>
  );
}
