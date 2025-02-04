import React from "react";
import { View, Dimensions } from "react-native";
import { PieChart, BarChart } from "react-native-chart-kit";

export default function Chart({ expenses }) {
  // Prepare data for the pie chart (category-wise expenses)
  const categoryData = expenses.reduce((acc, expense) => {
    const category = expense.category || "General";
    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {});

  const pieData = Object.keys(categoryData).map((category, index) => ({
    name: category,
    amount: categoryData[category],
    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
    legendFontColor: "#000",
    legendFontSize: 14,
  }));

  // Prepare data for the bar chart (spending over time)
  const barData = {
    labels: expenses.map((exp) => exp.date), // Dates
    datasets: [
      {
        data: expenses.map((exp) => exp.amount), // Amounts
      },
    ],
  };

  return (
    <View>
      {/* Pie Chart for Category-Wise Spending */}
      <PieChart
        data={pieData}
        width={Dimensions.get("window").width - 20}
        height={220}
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          color: () => `rgba(0, 0, 0, 0.5)`,
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
      />

      {/* Bar Chart for Spending Over Time */}
      <BarChart
        data={barData}
        width={Dimensions.get("window").width - 20}
        height={220}
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          color: () => `rgba(0, 0, 255, 0.5)`,
        }}
        verticalLabelRotation={30}
      />
    </View>
  );
}
