import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as PaperProvider } from "react-native-paper";
import HomeScreen from "./components/Screens/HomeScreen";
import ExpenseListScreen from "./components/Screens/ExpenseListScreen";
import AddExpenseScreen from "./components/Screens/AddExpenseScreen";
import { loadExpenses, saveExpenses } from "./Utils/Storage";
import * as Notifications from "expo-notifications";

// Stack Navigator
const Stack = createStackNavigator();

export default function App() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    loadExpenses(setExpenses);

    // Request notification permissions
    const requestPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        await Notifications.requestPermissionsAsync();
      }
    };
    requestPermissions();
  }, []);

  const addExpense = (expense) => {
    const updatedExpenses = [...expenses, expense];
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
  };

  const updateExpense = (updatedExpense) => {
    const updatedExpenses = expenses.map((exp) =>
      exp.id === updatedExpense.id ? updatedExpense : exp
    );
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
  };

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home">
            {(props) => <HomeScreen {...props} expenses={expenses} />}
          </Stack.Screen>
          <Stack.Screen name="ExpenseList">
            {(props) => (
              <ExpenseListScreen {...props} expenses={expenses} setExpenses={setExpenses} updateExpense={updateExpense} />
            )}
          </Stack.Screen>
          <Stack.Screen name="AddExpense">
            {(props) => <AddExpenseScreen {...props} addExpense={addExpense} updateExpense={updateExpense} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};
