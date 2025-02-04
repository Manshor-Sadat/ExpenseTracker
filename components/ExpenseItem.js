import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Card, Text, Avatar, Button } from "react-native-paper";
import moment from "moment";

// Function to return category-based icons
const getCategoryIcon = (category) => {
  const icons = {
    Food: "🍔",
    Travel: "✈️",
    Shopping: "🛍️",
    Bills: "💡",
    Entertainment: "🎮",
    Other: "💰",
  };
  return icons[category] || "💳"; // Default icon
};

export default function ExpenseItem({ expense, onDelete, onEdit }) {
  // Function to confirm before deleting
  const confirmDelete = () => {
    Alert.alert(
      "Delete Expense",
      `Are you sure you want to delete "${expense.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => onDelete(expense.id), style: "destructive" },
      ]
    );
  };

  return (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        <Avatar.Text size={40} label={getCategoryIcon(expense.category)} style={styles.avatar} />
        <View style={styles.textContainer}>
          <Text style={styles.expenseName}>{expense.name}</Text>
          <Text style={styles.category}>{expense.category}</Text>
          <Text style={styles.date}>
            {moment(expense.date, "MM/DD/YYYY").format("MMMM D, YYYY")} - {moment().format("hh:mm A")}
          </Text>
        </View>
        <Text style={styles.amount}>${expense.amount.toFixed(2)}</Text>
      </View>

      {/* Edit & Delete Buttons */}
      <View style={styles.buttonContainer}>
        <Button mode="outlined" onPress={() => onEdit(expense)}>
          <Text>Edit</Text> {/* ✅ Wrapped text inside <Text> */}
        </Button>
        <Button mode="contained" onPress={confirmDelete} color="red">
          <Text>Delete</Text> {/* ✅ Wrapped text inside <Text> */}
        </Button>
      </View>
    </Card>
  );
}

// ** Styles **
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    backgroundColor: "#eee",
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  expenseName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  category: {
    fontSize: 14,
    color: "#888",
  },
  date: {
    fontSize: 12,
    color: "#aaa",
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff6f61",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
