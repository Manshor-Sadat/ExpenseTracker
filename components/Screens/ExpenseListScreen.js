import React from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import { Text } from "react-native-paper";
import ExpenseItem from "../ExpenseItem"; // Import ExpenseItem

const ExpenseListScreen = ({ expenses, setExpenses, navigation, updateExpense }) => {
  // Function to delete an expense
  const handleDelete = (id) => {
    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
    setExpenses(updatedExpenses);
  };

  // Function to edit an expense (navigates to AddExpenseScreen with pre-filled data)
  const handleEdit = (expense) => {
    navigation.navigate("AddExpense", { expenseToEdit: expense, updateExpense });
  };

  return (
    <View style={styles.container}>
      {expenses.length === 0 ? (
        <Text style={styles.noExpenses}>No expenses recorded yet.</Text>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ExpenseItem expense={item} onDelete={handleDelete} onEdit={handleEdit} />
          )}
        />
      )}
    </View>
  );
};

// ** Styles **
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f8f9fa",
  },
  noExpenses: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});

export default ExpenseListScreen;
