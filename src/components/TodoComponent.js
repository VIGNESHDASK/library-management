import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import '../App.css';
import Scoreboard from './Scoreboard';

const TodoComponent = ({ filter, name }) => {
  const initialTodos = JSON.parse(localStorage.getItem(filter)) || [];
  const initialDetails = JSON.parse(localStorage.getItem(`${filter}-details`)) || [];
  const initialDates = JSON.parse(localStorage.getItem(`${filter}-dates`)) || [];

  const [todos, setTodos] = useState(initialTodos);
  const [inputValue, setInputValue] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [todoDetails, setTodoDetails] = useState(initialDetails);
  const [todoDates, setTodoDates] = useState(initialDates);

  useEffect(() => {
    localStorage.setItem(filter, JSON.stringify(todos));
    localStorage.setItem(`${filter}-details`, JSON.stringify(todoDetails));
    localStorage.setItem(`${filter}-dates`, JSON.stringify(todoDates));
  }, [todos, todoDetails, todoDates, filter]);

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo = inputValue.trim();
      setTodos([...todos, newTodo]);
      setTodoDetails([...todoDetails, '']);
      setTodoDates([...todoDates, new Date().toISOString().split('T')[0]]);
      setInputValue('');
    }
  };

  const removeTodo = (index) => {
    const confim  = window.confirm('Confirm to Remove from List. ' )

    if (!confim) return;


    const newTodos = todos.filter((_, i) => i !== index);
    const newDetails = todoDetails.filter((_, i) => i !== index);
    const newDates = todoDates.filter((_, i) => i !== index);

    setTodos(newTodos);
    setTodoDetails(newDetails);
    setTodoDates(newDates);
    setExpandedIndex(null);
  };

  const toggleTodoDetails = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleDetailChange = (e, index) => {
    const newDetails = [...todoDetails];
    newDetails[index] = e.target.value;
    setTodoDetails(newDetails);
  };

  const handleDateChange = (e, index) => {
    const newDates = [...todoDates];
    newDates[index] = e.target.value;
    setTodoDates(newDates);
  };


  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const details = Array.from(todoDetails);
    const dates = Array.from(todoDates);

    const [reorderedItem] = items.splice(result.source.index, 1);
    const [reorderedDetails] = details.splice(result.source.index, 1);
    const [reorderedDates] = dates.splice(result.source.index, 1);


    items.splice(result.destination.index, 0, reorderedItem);
    details.splice(result.destination.index, 0, reorderedDetails);
    dates.splice(result.destination.index, 0, reorderedDates);

    setTodos(items);
    setTodoDetails(details);
    setTodoDates(dates);
  };

  return (
    <>
    <Scoreboard score={todos.length}/>

    <div className="todo-container">
      <h1>{name}</h1>
      <div className="todo-input-container">
        <input
          type="text"
          placeholder="Add a new todo..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') addTodo(); }}
          className="todo-input"
        />
        <button onClick={addTodo} className="add-button">Add</button>
      </div>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef} className="todo-list">
              {todos.map((todo, index) => (
                <Draggable key={index} draggableId={index.toString()} index={index}>
                  {(provided) => (
                    <li
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    className="todo-item"
                  >
                    <span className="todo-number">{index + 1}.</span>
                    <span onClick={() => toggleTodoDetails(index)} className="todo-text">{todo}</span>
                    {expandedIndex !== index && (
                        <button onClick={() => removeTodo(index)} className="remove-button">
                          Remove
                        </button>
                      )}
                    {expandedIndex === index && (
                      <div className="todo-details">
                        <textarea
                          value={todoDetails[index] || ''}
                          onChange={(e) => handleDetailChange(e, index)}
                          placeholder="Edit todo details..."
                          className="todo-detail-input"
                        />
                        <input
                          type="date"
                          value={todoDates[index] || new Date().toISOString().split('T')[0]}
                          onChange={(e) => handleDateChange(e, index)}
                          className="date-input"
                        />
                      </div>
                    )}
                  </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
    </>
  );
};

export default TodoComponent;