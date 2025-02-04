import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Appbar,
  Button,
  TextInput,
  Text,
  ProgressBar,
  Menu,
} from "react-native-paper";
import Chart from "../Chart";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

const HomeScreen = ({ navigation, expenses }) => {
  const [budget, setBudget] = useState("");
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [budgetSet, setBudgetSet] = useState(false);
  const [budgetType, setBudgetType] = useState("Monthly");
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    loadBudget();

    // Notify user when they exceed the budget
    if (budget && remainingBudget < 0) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Budget Exceeded",
          body: `You have exceeded your ${budgetType} budget of $${budget}!`,
        },
        trigger: null,
      });
    }
  }, [expenses, budget, remainingBudget]);

  const loadBudget = async () => {
    try {
      const savedBudget = await AsyncStorage.getItem("budget");
      const savedBudgetType = await AsyncStorage.getItem("budgetType");

      if (savedBudget && savedBudgetType) {
        setBudget(savedBudget);
        setBudgetType(savedBudgetType);
        calculateRemainingBudget(savedBudget);
        setBudgetSet(true);
      }
    } catch (error) {
      console.error("Failed to load budget:", error);
    }
  };

  const saveBudget = async () => {
    if (!budget || isNaN(budget)) {
      Alert.alert("Invalid Input", "Please enter a valid numeric budget.");
      return;
    }
    try {
      await AsyncStorage.setItem("budget", budget);
      await AsyncStorage.setItem("budgetType", budgetType);
      calculateRemainingBudget(budget);
      setBudgetSet(true);
      Alert.alert("Success", `${budgetType} budget set successfully!`);
    } catch (error) {
      console.error("Failed to save budget:", error);
    }
  };

  const calculateRemainingBudget = (newBudget) => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    setRemainingBudget(newBudget - totalExpenses);
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const progress = budget ? Math.min(totalExpenses / budget, 1) : 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Appbar.Header>
          <Appbar.Content title="Expense Tracker" />
        </Appbar.Header>

        {/* Budget Input & Progress Bar */}
        {!budgetSet ? (
          <View style={styles.inputContainer}>
            <TextInput
              label="Set Budget"
              value={budget}
              keyboardType="numeric"
              onChangeText={setBudget}
              style={styles.input}
            />

            {/* Budget Type Selection */}
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setMenuVisible(true)}
                  style={styles.button}
                >
                  {budgetType} Budget
                </Button>
              }
            >
              <Menu.Item onPress={() => setBudgetType("Daily")} title="Daily Budget" />
              <Menu.Item onPress={() => setBudgetType("Weekly")} title="Weekly Budget" />
              <Menu.Item onPress={() => setBudgetType("Monthly")} title="Monthly Budget" />
            </Menu>

            <Button mode="contained" onPress={saveBudget} style={styles.button}>
              Save Budget
            </Button>
          </View>
        ) : (
          <View style={styles.budgetContainer}>
            <Text style={styles.budgetText}>
              {budgetType} Budget: ${budget}
            </Text>
            <Text style={styles.expenseText}>Total Spent: ${totalExpenses.toFixed(2)}</Text>
            <Text style={styles.remainingText}>
              Remaining Budget: ${remainingBudget.toFixed(2)}
            </Text>

            <ProgressBar
              progress={progress}
              color={progress >= 1 ? "red" : "#4caf50"} // Valid colors
              style={styles.progressBar}
            />

            <Button mode="outlined" onPress={() => setBudgetSet(false)} style={styles.button}>
              Modify Budget
            </Button>
          </View>
        )}

        {/* Expense Chart */}
        <Chart expenses={expenses} />

        <Button
          mode="contained"
          onPress={() => navigation.navigate("AddExpense")}
          style={[styles.button, styles.addExpenseButton]}
        >
          Add Expense
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.navigate("ExpenseList")}
          style={styles.button}
        >
          View Expenses
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  scrollContainer: { flexGrow: 1, padding: 20 },
  inputContainer: { marginTop: 20 },
  budgetContainer: { marginTop: 20 },
  input: { marginBottom: 20, backgroundColor: "white" },
  button: { marginVertical: 10 },
  addExpenseButton: { backgroundColor: "#6200ee" },
  budgetText: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  expenseText: { fontSize: 16, color: "#555", marginBottom: 5 },
  remainingText: { fontSize: 16, color: "#007bff", marginBottom: 10 },
  progressBar: { height: 10, borderRadius: 5, marginBottom: 20 },
});

export default HomeScreen;
