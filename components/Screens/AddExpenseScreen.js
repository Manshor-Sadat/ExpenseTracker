import React, { useState } from "react";
import { View, StyleSheet, Platform, ScrollView } from "react-native";
import { Card, TextInput, Button, Menu, Text } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AddExpenseScreen({ navigation, route, addExpense, updateExpense }) {
  const expenseToEdit = route.params?.expenseToEdit || null;

  const [expenseName, setExpenseName] = useState(expenseToEdit ? expenseToEdit.name : "");
  const [amount, setAmount] = useState(expenseToEdit ? expenseToEdit.amount.toString() : "");
  const [category, setCategory] = useState(expenseToEdit ? expenseToEdit.category : "Food");
  const [date, setDate] = useState(expenseToEdit ? new Date(expenseToEdit.date) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // **Dropdown Menu State**
  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const categories = [
    { label: "Food 🍔", value: "Food" },
    { label: "Travel ✈️", value: "Travel" },
    { label: "Shopping 🛍️", value: "Shopping" },
    { label: "Bills 💡", value: "Bills" },
    { label: "Entertainment 🎮", value: "Entertainment" },
    { label: "Other 💰", value: "Other" },
  ];

  const handleDateConfirm = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
    setShowDatePicker(false);
  };

  const handleSubmit = () => {
    if (!expenseName || !amount) return;

    const expenseData = {
      id: expenseToEdit ? expenseToEdit.id : Date.now(),
      name: expenseName,
      amount: parseFloat(amount),
      category,
      date: date.toLocaleDateString(),
    };

    expenseToEdit ? updateExpense(expenseData) : addExpense(expenseData);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Card style={styles.card}>
        <Card.Title title={expenseToEdit ? "Edit Expense" : "Add Expense"} />
        <Card.Content>
          <TextInput
            label="Expense Name"
            value={expenseName}
            onChangeText={setExpenseName}
            style={styles.input}
          />
          <TextInput
            label="Amount"
            value={amount}
            keyboardType="numeric"
            onChangeText={setAmount}
            style={styles.input}
          />

          {/* Category Dropdown Menu */}
          <Text style={styles.label}>Category:</Text>
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <Button mode="outlined" onPress={openMenu} style={styles.dropdown}>
                <Text>{category}</Text> {/* ✅ Wrapped text inside <Text> */}
              </Button>
            }
          >
            {categories.map((item) => (
              <Menu.Item
                key={item.value}
                onPress={() => {
                  setCategory(item.value);
                  closeMenu();
                }}
                title={<Text>{item.label}</Text>} // ✅ Wrapped text inside <Text>
              />
            ))}
          </Menu>

          {/* Date Picker */}
          <Button mode="outlined" onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
            <Text>Pick Date: {date.toDateString()}</Text> {/* ✅ Wrapped text inside <Text> */}
          </Button>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateConfirm}
            />
          )}
        </Card.Content>

        <Card.Actions>
          <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
            <Text>{expenseToEdit ? "Update Expense" : "Add Expense"}</Text> {/* ✅ Wrapped text inside <Text> */}
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, padding: 20, backgroundColor: "#f8f9fa" },
  card: { borderRadius: 10, padding: 15 },
  input: { marginBottom: 20, backgroundColor: "white" },
  label: { fontSize: 16, marginBottom: 5 },
  dropdown: { marginBottom: 20, alignSelf: "flex-start" },
  dateButton: { marginBottom: 20 },
  submitButton: { marginTop: 10 },
});

