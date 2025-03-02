import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

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
      setCurrentQuote(storedQuotes[Math.floor(Math.random() * storedQuotes.length)]);
    }
    if (storedTodo.length > 0) {
      setCurrentTodo(storedTodo[Math.floor(Math.random() * storedTodo.length)]);
    }
  }, []);

  // Function to get a new random item from an array
  const getRandomItem = useCallback((arr, currentItem) => {
    if (arr.length === 0) return '';
    let randomItem;
    do {
      randomItem = arr[Math.floor(Math.random() * arr.length)];
    } while (arr.length > 1 && randomItem === currentItem); // Avoid duplicate
    return randomItem;
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
