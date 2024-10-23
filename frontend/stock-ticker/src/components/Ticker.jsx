import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Ticker.css';

function Ticker() {
  const [symbols, setSymbols] = useState([]);

  useEffect(() => {
    const fetchSymbols = async () => {
      const response = await axios.get('http://localhost:5000/api/symbols');
      setSymbols(response.data);
    };

    fetchSymbols();
    const interval = setInterval(fetchSymbols, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ticker">
      <div className="ticker__list">
      {symbols.map((item) => (
  <div className="ticker__item" key={item.symbol}>
    {item.symbol}: ${item.price}
  </div>
        ))}
      </div>
    </div>
  );
}

export default Ticker;