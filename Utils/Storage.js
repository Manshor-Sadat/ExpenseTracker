import AsyncStorage from "@react-native-async-storage/async-storage";

export const loadExpenses = async (setExpenses) => {
  try {
    const savedExpenses = await AsyncStorage.getItem("expenses");
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
  } catch (error) {
    console.error("Failed to load expenses:", error);
  }
};

export const saveExpenses = async (expenses) => {
  try {
    await AsyncStorage.setItem("expenses", JSON.stringify(expenses));
  } catch (error) {
    console.error("Failed to save expenses:", error);
  }
};
