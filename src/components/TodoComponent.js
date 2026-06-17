 import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

// Helper to extract display text from an item (handles both string and object format)
const extractText = (item) => {
  if (typeof item === 'string') return item;
  if (item && typeof item === 'object') return item.text || '';
  return '';
};

const TilesComponent = ({ tiles, isQuotesEnabled }) => {
  const [quotes, setQuotes] = useState([]);
  const [todoList, setTodoList] = useState([]);
  const [currentQuote, setCurrentQuote] = useState('');
  const [currentTodo, setCurrentTodo] = useState('');

  // Load from localStorage once on mount
  useEffect(() => {
    const storedQuotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    const storedTodo = JSON.parse(localStorage.getItem('today') || '[]');

    setQuotes(storedQuotes);
    setTodoList(storedTodo);

    if (storedQuotes.length > 0) {
      setCurrentQuote(extractText(storedQuotes[Math.floor(Math.random() * storedQuotes.length)]));
    }
    if (storedTodo.length > 0) {
      setCurrentTodo(extractText(storedTodo[Math.floor(Math.random() * storedTodo.length)]));
    }
  }, []);

  // Function to get a new random item from an array (extracts text from object format)
  const getRandomItem = useCallback((arr, currentItem) => {
    if (arr.length === 0) return '';
    let randomItem;
    do {
      randomItem = arr[Math.floor(Math.random() * arr.length)];
    } while (arr.length > 1 && extractText(randomItem) === currentItem); // Avoid duplicate
    return extractText(randomItem);
  }, []);

  // Auto-change quotes every 10 seconds
  useEffect(() => {
    if (quotes.length > 1) {
      const interval = setInterval(() => {
        setCurrentQuote(getRandomItem(quotes, currentQuote));
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [quotes, currentQuote, getRandomItem]);

  const getJsonData = () => {
    // Create an object to hold all key-value pairs
    const allData = {};

    // Loop through local storage and add each key-value pair to the object
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      allData[key] = localStorage.getItem(key);
    }

    // Convert the data into JSON format
    const jsonData = JSON.stringify(allData, null, 2);

    // Create a Blob object
    const blob = new Blob([jsonData], { type: 'application/json' });

    // Generate a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'localStorageData.json';

    // Trigger the download
    downloadLink.click();
  };

  // Auto-change todo every 10 seconds
  useEffect(() => {
    if (todoList.length > 1) {
      const interval = setInterval(() => {
        setCurrentTodo(getRandomItem(todoList, currentTodo));
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [todoList, currentTodo, getRandomItem]);

  return (
    <>
      <div className="content-container">
        {isQuotesEnabled && (
          <div
            className="quotes-container"
            onClick={() => setCurrentQuote(getRandomItem(quotes, currentQuote))}
            style={{ cursor: 'pointer' }}
          >
            <p>{currentQuote || 'No quotes available.'}</p>
          </div>
        )}

        {isQuotesEnabled && (
          <div
            className="quotes-container"
            onClick={() => setCurrentTodo(getRandomItem(todoList, currentTodo))}
            style={{ cursor: 'pointer' }}
          >
            <p>{currentTodo || 'No tasks available.'}</p>
          </div>
        )}
      </div>

      <div className="tiles-container">
        {tiles.map((tile, index) => (
          <Link key={index} to={tile.path} className="tile">
            {tile.label}
          </Link>
        ))}
      </div>
    </>
  );
};

export default TilesComponent;
