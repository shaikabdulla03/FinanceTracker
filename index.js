// ✅ Load existing transactions from localStorage (if available)
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// ✅ DOM Elements
const transactionsList = document.getElementById("transactions");
const incomeEl = document.getElementById("income");
const expensesEl = document.getElementById("expenses");
const balanceEl = document.getElementById("balance");

// ✅ Chart.js variables
let expenseChart, trendChart;

/**
 * ✅ Update UI with transactions, balance, income, expenses, and charts
 */
function updateUI() {
  transactionsList.innerHTML = "";

  let income = 0, expenses = 0;

  transactions.forEach((t, index) => {
    // Create a transaction list item
    const li = document.createElement("li");
    li.classList.add(t.type);
    li.innerHTML = `
      ${t.desc} - ₹${t.amount} <small>(${t.date})</small>
      <button onclick="deleteTransaction(${index})">❌</button>
    `;
    transactionsList.appendChild(li);

    // Update totals
    if (t.type === "income") income += t.amount;
    else expenses += t.amount;
  });

  // Calculate balance
  const balance = income - expenses;

  // Update summary values
  incomeEl.textContent = `₹${income}`;
  expensesEl.textContent = `₹${expenses}`;
  balanceEl.textContent = `₹${balance}`;

  // Save data to localStorage
  localStorage.setItem("transactions", JSON.stringify(transactions));

  // Update charts
  updateCharts();
}

/**
 * ✅ Add a new transaction
 */
function addTransaction() {
  const desc = document.getElementById("desc").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;
  const date = document.getElementById("date").value || new Date().toISOString().split("T")[0];

  // Validation
  if (!desc || !amount) return alert("Please enter description and amount");

  // Push new transaction into array
  transactions.push({ desc, amount, type, date });

  // Update UI
  updateUI();

  // Clear input fields
  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";
}

/**
 * ✅ Delete transaction by index
 */
function deleteTransaction(index) {
  transactions.splice(index, 1); // Remove item from array
  updateUI(); // Refresh UI
}

/**
 * ✅ Update charts using Chart.js
 */
function updateCharts() {
  const categories = {}; // For expense categories
  const trends = {};     // For monthly trend

  // Process transactions
  transactions.forEach(t => {
    if (t.type === "expense") {
      // Sum amounts by description (category)
      categories[t.desc] = (categories[t.desc] || 0) + t.amount;
    }

    // Group by month (YYYY-MM)
    const month = t.date.slice(0, 7);
    trends[month] = (trends[month] || 0) + (t.type === "expense" ? t.amount : -t.amount);
  });

  // ✅ Expense Pie Chart
  if (expenseChart) expenseChart.destroy(); // Destroy old chart before re-rendering
  expenseChart = new Chart(document.getElementById("expenseChart"), {
    type: "pie",
    data: {
      labels: Object.keys(categories),
      datasets: [{
        data: Object.values(categories),
        backgroundColor: ["#f44336", "#ff9800", "#4CAF50", "#2196F3", "#9c27b0"]
      }]
    }
  });

  // ✅ Balance Trend Line Chart
  if (trendChart) trendChart.destroy();
  trendChart = new Chart(document.getElementById("trendChart"), {
    type: "line",
    data: {
      labels: Object.keys(trends),
      datasets: [{
        label: "Balance Trend",
        data: Object.values(trends),
        borderColor: "#4CAF50",
        fill: false
      }]
    }
  });
}

// ✅ Initial Load
updateUI();
