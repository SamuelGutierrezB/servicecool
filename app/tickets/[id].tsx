import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Picker,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { TicketService } from "../../services/tickets";

export default function EditTicketScreen() {
  const { id } = useLocalSearchParams();
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pendiente",
    priority: "media",
    location: "",
    fridgeModel: "",
    type: "falla",
    dueDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const ticket = await TicketService.getTicketById(id);
        setForm({
          title: ticket.title || "",
          description: ticket.description || "",
          status: ticket.status || "pendiente",
          priority: ticket.priority || "media",
          location: ticket.location || "",
          fridgeModel: ticket.fridgeModel || "",
          type: ticket.type || "falla",
          dueDate: ticket.dueDate || "",
        });
      } catch (error) {
        console.error(error);
        alert("Error al cargar el ticket");
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await TicketService.updateTicket(id, form);
      router.back();
    } catch (error) {
      console.error(error);
      alert("Error al actualizar el ticket");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={form.title}
        onChangeText={(text) => setForm({ ...form, title: text })}
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        value={form.description}
        onChangeText={(text) => setForm({ ...form, description: text })}
      />

      <Text style={styles.label}>Estado</Text>
      <Picker
        selectedValue={form.status}
        style={styles.picker}
        onValueChange={(itemValue) => setForm({ ...form, status: itemValue })}
      >
        <Picker.Item label="Pendiente" value="pendiente" />
        <Picker.Item label="En progreso" value="en progreso" />
        <Picker.Item label="Resuelto" value="resuelto" />
      </Picker>

      <Text style={styles.label}>Prioridad</Text>
      <Picker
        selectedValue={form.priority}
        style={styles.picker}
        onValueChange={(itemValue) => setForm({ ...form, priority: itemValue })}
      >
        <Picker.Item label="Alta" value="alta" />
        <Picker.Item label="Media" value="media" />
        <Picker.Item label="Baja" value="baja" />
      </Picker>

      <Text style={styles.label}>Ubicación</Text>
      <TextInput
        style={styles.input}
        value={form.location}
        onChangeText={(text) => setForm({ ...form, location: text })}
      />

      <Text style={styles.label}>Modelo de Refrigerador</Text>
      <TextInput
        style={styles.input}
        value={form.fridgeModel}
        onChangeText={(text) => setForm({ ...form, fridgeModel: text })}
      />

      <Text style={styles.label}>Tipo de Servicio</Text>
      <Picker
        selectedValue={form.type}
        style={styles.picker}
        onValueChange={(itemValue) => setForm({ ...form, type: itemValue })}
      >
        <Picker.Item label="Falla" value="falla" />
        <Picker.Item label="Revisión" value="revisión" />
        <Picker.Item label="Mantenimiento" value="mantenimiento" />
      </Picker>

      <Text style={styles.label}>Fecha programada (opcional)</Text>
      <TextInput
        style={styles.input}
        value={form.dueDate}
        onChangeText={(text) => setForm({ ...form, dueDate: text })}
        placeholder="YYYY-MM-DD"
      />

      <Button
        title={saving ? "Guardando..." : "Guardar Cambios"}
        onPress={handleSubmit}
        disabled={saving}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginBottom: 16,
  },
});
