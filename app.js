// app.js - Main application initialization and coordination

// Import functions from other modules (in a real module system)
// For now, we'll rely on global scope

function initializeApp() {
    // Load initial data
    loadTransactions();
    
    // Check if we need sample data
    if (transactions.length === 0) {
        createSampleData();
    }
    
    // Update UI with initial data
    updateUI();
}

function createSampleData() {
    const sampleTransactions = [
        {
            id: generateId(),
            type: 'income',
            amount: 3500,
            category: 'Salary',
            date: new Date().toISOString().split('T')[0],
            notes: 'Monthly salary',
            createdAt: new Date().toISOString()
        },
        {
            id: generateId(),
            type: 'expense',
            amount: 1200,
            category: 'Housing',
            date: new Date().toISOString().split('T')[0],
            notes: 'Rent payment',
            createdAt: new Date().toISOString()
        },
        {
            id: generateId(),
            type: 'expense',
            amount: 350,
            category: 'Food',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            notes: 'Groceries',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: generateId(),
            type: 'expense',
            amount: 150,
            category: 'Transportation',
            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            notes: 'Gas and parking',
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: generateId(),
            type: 'income',
            amount: 500,
            category: 'Freelance',
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            notes: 'Web design project',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];
    
    transactions = sampleTransactions;
    saveTransactions();
}

// Initialize the app when everything is loaded
document.addEventListener('DOMContentLoaded', initializeApp);