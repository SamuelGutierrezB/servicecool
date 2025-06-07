import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      {/* Header con logo */}
      <ThemedView style={styles.header}>
        <Image
          source={require("@/assets/images/logo.jpg")}
          style={styles.logo}
          contentFit="contain"
        />
        <ThemedText type="title" style={styles.headerTitle}>
          ServiceCool
        </ThemedText>
        <ThemedText type="default" style={styles.headerSubtitle}>
          Mantenimiento Inteligente de Refrigeración
        </ThemedText>
      </ThemedView>

      {/* Acciones rápidas */}
      <ThemedView style={styles.actionsContainer}>
        <Link href="/tickets/create" asChild>
          <TouchableOpacity style={styles.actionCard}>
            <ThemedView style={styles.actionIconContainer}>
              <MaterialIcons name="add-circle" size={28} color="#007AFF" />
            </ThemedView>
            <ThemedText type="defaultSemiBold">Nuevo Ticket</ThemedText>
            <ThemedText type="default" style={styles.actionDescription}>
              Reportar un problema o solicitar mantenimiento
            </ThemedText>
          </TouchableOpacity>
        </Link>

        <Link href="/(tabs)/tickets" asChild>
          <TouchableOpacity style={styles.actionCard}>
            <ThemedView style={styles.actionIconContainer}>
              <MaterialIcons name="list-alt" size={28} color="#34C759" />
            </ThemedView>
            <ThemedText type="defaultSemiBold">Mis Tickets</ThemedText>
            <ThemedText type="default" style={styles.actionDescription}>
              Revisa el estado de tus solicitudes
            </ThemedText>
          </TouchableOpacity>
        </Link>
      </ThemedView>

      {/* Estadísticas rápidas */}
      {/* <ThemedView style={styles.statsContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Resumen Rápido
        </ThemedText>

        <ThemedView style={styles.statsRow}>
          <ThemedView style={styles.statCard}>
            <ThemedText type="default">Pendientes</ThemedText>
            <ThemedText type="title">3</ThemedText>
          </ThemedView>

          <ThemedView style={styles.statCard}>
            <ThemedText type="default">En Progreso</ThemedText>
            <ThemedText type="title">1</ThemedText>
          </ThemedView>

          <ThemedView style={styles.statCard}>
            <ThemedText type="default">Resueltos</ThemedText>
            <ThemedText type="title">12</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView> */}

      {/* Mantenimientos próximos
      <ThemedView style={styles.maintenanceContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Próximos Mantenimientos
        </ThemedText>

        <ThemedView style={styles.maintenanceItem}>
          <MaterialIcons name="kitchen" size={24} color="#FF9500" />
          <ThemedView style={styles.maintenanceText}>
            <ThemedText type="defaultSemiBold">
              Refrigerador Principal
            </ThemedText>
            <ThemedText type="default">15 Oct 2023</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.maintenanceItem}>
          <MaterialIcons name="ac-unit" size={24} color="#5856D6" />
          <ThemedView style={styles.maintenanceText}>
            <ThemedText type="defaultSemiBold">Cámara de Congelados</ThemedText>
            <ThemedText type="default">22 Oct 2023</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView> */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    width: 220,
    height: 220,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 16,
  },
  actionCard: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.02)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  actionIconContainer: {
    marginBottom: 8,
  },
  actionDescription: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 4,
    color: "#666",
  },
  sectionTitle: {
    marginBottom: 16,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.02)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  maintenanceContainer: {
    marginBottom: 24,
  },
  maintenanceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  maintenanceText: {
    marginLeft: 12,
  },
});
