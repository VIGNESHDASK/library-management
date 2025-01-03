import React, { useState } from 'react';
import '../App.css';

const TodoComponent = ({filter}) => {
  // Retrieve todos from local storage on component initialization
  const initialTodos = JSON.parse(localStorage.getItem(filter)) || [];
  const [todos, setTodos] = useState(initialTodos);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodos = [...todos, inputValue.trim()];
      setTodos(newTodos);
      localStorage.setItem(filter, JSON.stringify(newTodos)); // Save todos to local storage
      setInputValue('');
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const removeTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos)); // Save updated todos to local storage
  };

  return (
    <div className="todo-container">
      <h1>Todo List</h1>
      <input
        type="text"
        placeholder="Add a new todo..."
        value={inputValue}
        onChange={handleInputChange}
        className="todo-input"
      />
      <button onClick={addTodo} className="add-button">
        Add Todo
      </button>
      <ul className="todo-list">
        {todos.map((todo, index) => (
          <li key={index} className="todo-item">
            {todo}
            <button onClick={() => removeTodo(index)} className="remove-button">
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoComponent;
