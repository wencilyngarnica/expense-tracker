// data.js - Data handling and localStorage operations

const STORAGE_KEYS = {
    TRANSACTIONS: 'expenseTrackerTransactions',
    BUDGETS: 'expenseTrackerBudgets'
};

// Categories
const CATEGORIES = {
    INCOME: ["Salary", "Freelance", "Investments", "Gifts", "Business", "Rental", "Other"],
    EXPENSE: ["Housing", "Transportation", "Food", "Utilities", "Healthcare", "Entertainment", "Shopping", "Education", "Other"]
};

// Transaction state
let transactions = [];
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Initialize data from localStorage
function loadTransactions() {
    const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    transactions = stored ? JSON.parse(stored) : [];
    return transactions;
}

function saveTransactions() {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
}

function getTransactions() {
    return transactions;
}

function getTransactionsByMonth(month = currentMonth, year = currentYear) {
    return transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() === month && 
               transactionDate.getFullYear() === year;
    });
}

function addTransaction(transaction) {
    transaction.id = generateId();
    transaction.createdAt = new Date().toISOString();
    transactions.push(transaction);
    saveTransactions();
    return transaction;
}

function updateTransaction(id, updates) {
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
        transactions[index] = { ...transactions[index], ...updates };
        saveTransactions();
        return transactions[index];
    }
    return null;
}

function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveTransactions();
    return true;
}

function getTransactionById(id) {
    return transactions.find(t => t.id === id);
}

function getSummary(month = currentMonth, year = currentYear) {
    const monthlyTransactions = getTransactionsByMonth(month, year);
    
    const totalIncome = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
    const totalExpense = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
        
    const balance = totalIncome - totalExpense;
    
    return {
        totalIncome,
        totalExpense,
        balance,
        transactionCount: monthlyTransactions.length
    };
}

function getCategoryTotals(month = currentMonth, year = currentYear) {
    const monthlyTransactions = getTransactionsByMonth(month, year);
    const expensesByCategory = {};
    
    monthlyTransactions
        .filter(t => t.type === 'expense')
        .forEach(transaction => {
            if (!expensesByCategory[transaction.category]) {
                expensesByCategory[transaction.category] = 0;
            }
            expensesByCategory[transaction.category] += transaction.amount;
        });
    
    return expensesByCategory;
}

function setCurrentMonth(month, year) {
    currentMonth = month;
    currentYear = year;
}

function getCurrentMonth() {
    return { month: currentMonth, year: currentYear };
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Export functions for other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadTransactions,
        saveTransactions,
        getTransactions,
        getTransactionsByMonth,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getTransactionById,
        getSummary,
        getCategoryTotals,
        setCurrentMonth,
        getCurrentMonth,
        CATEGORIES
    };
}