// ui.js - UI rendering and DOM manipulation

// DOM Elements cache
const DOM = {};

function initUI() {
    cacheDOMElements();
    setupEventListeners();
    renderDashboard();
    renderTransactionForm();
    renderMonthFilter();
    updateUI();
}

function cacheDOMElements() {
    DOM.dashboard = document.getElementById('dashboard');
    DOM.transactionForm = document.getElementById('transaction-form');
    DOM.transactionsBody = document.getElementById('transactions-body');
    DOM.emptyTransactions = document.getElementById('empty-transactions');
    DOM.monthFilter = document.getElementById('month-filter');
    DOM.incomeTypeBtn = document.getElementById('income-type-btn');
    DOM.expenseTypeBtn = document.getElementById('expense-type-btn');
    DOM.currentYear = document.getElementById('current-year');
}

function setupEventListeners() {
    // Transaction type toggle
    DOM.incomeTypeBtn.addEventListener('click', () => {
        DOM.incomeTypeBtn.classList.add('active');
        DOM.expenseTypeBtn.classList.remove('active');
        updateCategoryOptions('income');
    });
    
    DOM.expenseTypeBtn.addEventListener('click', () => {
        DOM.expenseTypeBtn.classList.add('active');
        DOM.incomeTypeBtn.classList.remove('active');
        updateCategoryOptions('expense');
    });
    
    // Month filter
    DOM.monthFilter.addEventListener('change', handleMonthFilterChange);
    
    // Set current year in footer
    DOM.currentYear.textContent = new Date().getFullYear();
}

function renderDashboard() {
    const summary = getSummary();
    
    DOM.dashboard.innerHTML = `
        <div class="summary-card income-summary">
            <h3>Total Income</h3>
            <div class="amount" id="total-income">$${summary.totalIncome.toFixed(2)}</div>
        </div>
        <div class="summary-card expense-summary">
            <h3>Total Expenses</h3>
            <div class="amount" id="total-expense">$${summary.totalExpense.toFixed(2)}</div>
        </div>
        <div class="summary-card balance-summary">
            <h3>Remaining Balance</h3>
            <div class="amount" id="remaining-balance">$${summary.balance.toFixed(2)}</div>
        </div>
        <div class="summary-card">
            <h3>Selected Month</h3>
            <div class="amount" id="current-month">${getCurrentMonthDisplay()}</div>
        </div>
    `;
    
    // Update balance color
    const balanceEl = document.getElementById('remaining-balance');
    if (summary.balance < 0) {
        balanceEl.style.color = '#e74c3c';
    } else if (summary.balance === 0) {
        balanceEl.style.color = '#7f8c8d';
    } else {
        balanceEl.style.color = '#2ecc71';
    }
}

function renderTransactionForm() {
    DOM.transactionForm.innerHTML = `
        <div class="form-group">
            <label for="amount">Amount ($)</label>
            <input type="number" id="amount" step="0.01" min="0.01" placeholder="0.00" required>
        </div>
        
        <div class="form-group">
            <label for="category">Category</label>
            <select id="category" required></select>
        </div>
        
        <div class="form-group">
            <label for="date">Date</label>
            <input type="date" id="date" required>
        </div>
        
        <div class="form-group">
            <label for="notes">Notes (Optional)</label>
            <textarea id="notes" rows="3" placeholder="Add a note about this transaction"></textarea>
        </div>
        
        <input type="hidden" id="transaction-id" value="">
        <button type="submit" class="btn btn-primary" id="submit-btn">Add Transaction</button>
        <button type="button" class="btn btn-danger" id="cancel-edit-btn" style="display:none;">Cancel Edit</button>
    `;
    
    // Set default date
    document.getElementById('date').valueAsDate = new Date();
    
    // Initialize category dropdown
    updateCategoryOptions('income');
    
    // Set up form submit handler
    DOM.transactionForm.addEventListener('submit', handleFormSubmit);
    
    // Set up cancel edit button
    document.getElementById('cancel-edit-btn').addEventListener('click', resetForm);
}

function updateCategoryOptions(type) {
    const categorySelect = document.getElementById('category');
    const categories = type === 'income' ? CATEGORIES.INCOME : CATEGORIES.EXPENSE;
    
    categorySelect.innerHTML = categories
        .map(category => `<option value="${category}">${category}</option>`)
        .join('');
}

function renderMonthFilter() {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    const currentYear = new Date().getFullYear();
    let options = '';
    
    for (let year = currentYear; year >= currentYear - 1; year--) {
        for (let month = 11; month >= 0; month--) {
            const isSelected = month === currentMonth && year === currentYear;
            options += `<option value="${year}-${month}" ${isSelected ? 'selected' : ''}>
                ${monthNames[month]} ${year}
            </option>`;
        }
    }
    
    DOM.monthFilter.innerHTML = options;
}

function renderTransactions() {
    const transactions = getTransactionsByMonth();
    
    if (transactions.length === 0) {
        DOM.transactionsBody.innerHTML = '';
        DOM.emptyTransactions.style.display = 'block';
        return;
    }
    
    DOM.emptyTransactions.style.display = 'none';
    
    // Sort by date (newest first)
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const html = transactions.map(transaction => {
        const date = new Date(transaction.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
        
        const amountClass = transaction.type === 'income' ? 'income-row' : 'expense-row';
        const amountSign = transaction.type === 'income' ? '+' : '-';
        
        return `
        <tr class="${amountClass}">
            <td>${formattedDate}</td>
            <td>${transaction.notes || transaction.category}</td>
            <td><span class="category-badge">${transaction.category}</span></td>
            <td><strong>${amountSign}$${transaction.amount.toFixed(2)}</strong></td>
            <td class="actions-cell">
                <button class="btn btn-edit" onclick="window.editTransaction('${transaction.id}')">Edit</button>
                <button class="btn btn-danger" onclick="window.deleteTransaction('${transaction.id}')">Delete</button>
            </td>
        </tr>
        `;
    }).join('');
    
    DOM.transactionsBody.innerHTML = html;
}

function updateUI() {
    renderDashboard();
    renderTransactions();
    updateChartData();
}

function getCurrentMonthDisplay() {
    const { month, year } = getCurrentMonth();
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return `${monthNames[month]} ${year}`;
}

function handleMonthFilterChange(e) {
    const [year, month] = e.target.value.split('-').map(Number);
    setCurrentMonth(month, year);
    updateUI();
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const transactionId = document.getElementById('transaction-id').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    const notes = document.getElementById('notes').value;
    const type = DOM.incomeTypeBtn.classList.contains('active') ? 'income' : 'expense';
    
    if (transactionId) {
        // Update existing transaction
        updateTransaction(transactionId, { amount, category, date, notes, type });
    } else {
        // Add new transaction
        addTransaction({ type, amount, category, date, notes });
    }
    
    resetForm();
    updateUI();
}

function resetForm() {
    DOM.transactionForm.reset();
    document.getElementById('transaction-id').value = '';
    document.getElementById('date').valueAsDate = new Date();
    document.getElementById('submit-btn').textContent = 'Add Transaction';
    document.getElementById('cancel-edit-btn').style.display = 'none';
    
    // Reset to income type
    DOM.incomeTypeBtn.classList.add('active');
    DOM.expenseTypeBtn.classList.remove('active');
    updateCategoryOptions('income');
}

// Make functions available globally for inline event handlers
window.editTransaction = function(id) {
    const transaction = getTransactionById(id);
    if (!transaction) return;
    
    // Fill form with transaction data
    document.getElementById('transaction-id').value = transaction.id;
    document.getElementById('amount').value = transaction.amount;
    document.getElementById('category').value = transaction.category;
    document.getElementById('date').value = transaction.date;
    document.getElementById('notes').value = transaction.notes || '';
    
    // Set transaction type
    if (transaction.type === 'income') {
        DOM.incomeTypeBtn.classList.add('active');
        DOM.expenseTypeBtn.classList.remove('active');
        updateCategoryOptions('income');
    } else {
        DOM.expenseTypeBtn.classList.add('active');
        DOM.incomeTypeBtn.classList.remove('active');
        updateCategoryOptions('expense');
    }
    
    // Update UI
    document.getElementById('submit-btn').textContent = 'Update Transaction';
    document.getElementById('cancel-edit-btn').style.display = 'inline-block';
};

window.deleteTransaction = function(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        deleteTransaction(id);
        updateUI();
    }
};

// Initialize UI when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI);
} else {
    initUI();
}