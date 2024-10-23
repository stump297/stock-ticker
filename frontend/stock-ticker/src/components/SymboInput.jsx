import React, { useState } from 'react';
import axios from 'axios';

function SymbolInput({ onAdd }) {
  const [symbol, setSymbol] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (symbol) {
      try {
        const response = await axios.post('http://localhost:5000/api/symbols', { name: symbol });
        onAdd(response.data);
        setSymbol('');
      } catch (error) {
        alert('Error adding symbol. It might already exist.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Enter Symbol (e.g., AAPL)"
      />
      <button type="submit">Add Symbol</button>
    </form>
  );
}

export default SymbolInput;