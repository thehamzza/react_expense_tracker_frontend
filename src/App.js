import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [transactionType, setTransactionType] = useState('earning');
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      //const response = await axios.get('http://localhost:8000/api/transactions/');
      const response = await axios.get('https://django-expense-tracker-api.vercel.app/api/transactions/');
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleAddTransaction = async () => {
    if (!amount || !title || !date) {
      alert('Please fill in all fields');
      return;
    }

    const transaction = {
      type: transactionType,
      title,
      amount: parseFloat(amount),
      date,
      currency,
    };

    try {
      //await axios.post('http://localhost:8000/api/transactions/', transaction);
      await axios.post('https://django-expense-tracker-api.vercel.app/api/transactions/', transaction);
      fetchTransactions(); // Refresh the transactions
      setAmount('');
      setTitle('');
      setDate(new Date().toISOString().split('T')[0]);
      setTransactionType('earning');
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const sortedTransactions = transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  const earnings = sortedTransactions.filter(t => t.type === 'earning');
  const expenses = sortedTransactions.filter(t => t.type === 'expense');

  const totalEarnings = earnings.reduce((acc, entry) => acc + parseFloat(entry.amount), 0).toFixed(2);
  const totalExpenses = expenses.reduce((acc, entry) => acc + parseFloat(entry.amount), 0).toFixed(2);

  return (
    <div className="app-container">
      <header className="header">
        <h1>Expense Tracker</h1>
        <p>Keep track of your earnings and expenses easily</p>
      </header>
      <div className="content">
        <div className="transaction-form">
          <div className="form-header">
            <h2>Add Transaction</h2>
            <label className="currency-selector">
              Currency:
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
                <option value="PKR">PKR</option>
              </select>
            </label>
          </div>
          <form>
            <div className="form-row">
              <label>
                Type:
                <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
                  <option value="earning">Earning</option>
                  <option value="expense">Expense</option>
                </select>
              </label>
              <label>
                Title:
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
              </label>
            </div>
            <div className="form-row">
              <label>
                Amount:
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </label>
              <label>
                Date:
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
              <button type="button" onClick={handleAddTransaction}>
                Add
              </button>
            </div>
          </form>
        </div>
        <div className="tables-container">
          <div className="table-wrapper">
            <h2>Earnings</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {earnings.map((entry, index) => (
                  <tr key={index}>
                    <td>{new Date(entry.date).toLocaleDateString('en-GB')}</td>
                    <td>{entry.title}</td>
                    <td>{parseFloat(entry.amount).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3>Total Earnings: {totalEarnings} {currency}</h3>
          </div>
          <div className="table-wrapper">
            <h2>Expenses</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((entry, index) => (
                  <tr key={index}>
                    <td>{new Date(entry.date).toLocaleDateString('en-GB')}</td>
                    <td>{entry.title}</td>
                    <td>{parseFloat(entry.amount).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3>Total Expenses: {totalExpenses} {currency}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
