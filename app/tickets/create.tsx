import { router } from "expo-router";
import React, { useState } from "react";
import {
  Button,
  Picker,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { TicketService } from "../../services/tickets";

export default function CreateTicketScreen() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "media",
    location: "",
    fridgeModel: "",
    type: "falla",
    dueDate: new Date(),
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await TicketService.createTicket({
        title: form.title,
        description: form.description,
        priority: form.priority,
        location: form.location,
        fridgeModel: form.fridgeModel,
        type: form.type,
        dueDate: form.dueDate,
        status: "pendiente", // Estado inicial
      });
      router.back();
    } catch (error) {
      console.error(error);
      alert("Error al crear el ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={form.title}
        onChangeText={(text) => setForm({ ...form, title: text })}
        placeholder="Ej: Refrigerador no enfría"
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        value={form.description}
        onChangeText={(text) => setForm({ ...form, description: text })}
        placeholder="Describa el problema en detalle"
      />

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
        placeholder="Ej: Heladería Principal - Calle 123"
      />

      <Text style={styles.label}>Modelo de Refrigerador</Text>
      <TextInput
        style={styles.input}
        value={form.fridgeModel}
        onChangeText={(text) => setForm({ ...form, fridgeModel: text })}
        placeholder="Ej: CoolMaster XT-4000"
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

      <Button
        title={loading ? "Enviando..." : "Crear Ticket"}
        onPress={handleSubmit}
        disabled={loading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
