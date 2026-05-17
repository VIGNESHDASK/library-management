
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import '../App.css';
import Scoreboard from './Scoreboard';
import { Link } from 'react-router-dom';

const Problem = ({ filter }) => {
  const initialTodos = JSON.parse(localStorage.getItem(filter)) || [];
  const initialDetails = JSON.parse(localStorage.getItem(`${filter}-details`)) || [];
  const initialDates = JSON.parse(localStorage.getItem(`${filter}-dates`)) || [];
  const savedHeading = localStorage.getItem('problem-heading') ? localStorage.getItem('problem-heading') : '';

  const [todos, setTodos] = useState(initialTodos);
  const [inputValue, setInputValue] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [todoDetails, setTodoDetails] = useState(initialDetails);
  const [todoDates, setTodoDates] = useState(initialDates);
  const [isHeading, setIsHeading] = useState(savedHeading);
  const [isProblem, setIsProblem] = useState(false);

  useEffect(() => {
    localStorage.setItem(filter, JSON.stringify(todos));
    localStorage.setItem(`${filter}-details`, JSON.stringify(todoDetails));
    localStorage.setItem(`${filter}-dates`, JSON.stringify(todoDates));
    localStorage.setItem('problem-heading', isHeading);
  }, [todos, todoDetails, todoDates, filter, isHeading]);

  useEffect(() => {
    if(filter === 'problems') {
      setIsProblem(true);
    }
  }, [filter]);

  

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      setTodos((prevTodos) => [...prevTodos, inputValue.trim()]);
      setTodoDetails((prevDetails) => [...prevDetails, '']);
      setTodoDates((prevDates) => [...prevDates, new Date().toISOString().split('T')[0]]);
      setInputValue('');
    }
  };

  const addHeading = () => {
    if (inputValue.trim() !== '') {
      setIsHeading(inputValue.trim());
      setInputValue('');
    }
  };

  const clearProblem = () => {
    if (isHeading !== '') {
      setIsHeading('');
      setTodos([]);
    setTodoDetails([]);
    setTodoDates([]);
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

    const items = [...todos];
    const details = [...todoDetails];
    const dates = [...todoDates];

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

  const placeholderTexts = [
    "Write the first step...",
    "What’s the next action?",
    "Describe a solution...",
    "Add a task to tackle this...",
    "Break it down into a step...",
  ];
  
  const [placeholder, setPlaceholder] = useState(placeholderTexts[0]);
  ;
  
  

    useEffect(() => {
      if (!isProblem) return;

      if (todos.length === 0) {
         setPlaceholder("Start Thinking...");
      } 
      if (todos.length > 2 && todos.length < 4) {
        setPlaceholder("Commom people do...");
      } 
      if (todos.length > 4 && todos.length < 8) {
        setPlaceholder("Think Roi ...");
      } 
      if (todos.length > 8 && todos.length < 11) {
        setPlaceholder("Different perspective...");
      } 
      if (todos.length > 11 && todos.length < 13) {
        setPlaceholder("Brainstroming...");
      } 
      if (todos.length > 13 && todos.length < 14) {
        setPlaceholder("Seek the excellence...");
      }
      
    }, [todos, isProblem]);



  
  
  return (
    <>
      <Scoreboard score={todos.length} />

      
      <div className="nav-links">
        <Link to="/today" className="nav-link">Today's Tasks</Link>
        <Link to="/week" className="nav-link">Weekly Tasks</Link>
        <Link to="/month" className="nav-link">Monthly Tasks</Link>
      </div>
        
      <div className="todo-container"> 

        {
          isProblem && (
            isHeading ? (
              <>
            <h5>{`how I can solve: ${isHeading} Problem`}</h5>
            <div className="todo-input-container">
              <input
                type="text"
                placeholder={true ? placeholder : "abc"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') addTodo(); }}
                className="todo-input"
              />
              <button onClick={addTodo} className="add-button">Add</button>
            </div>
            
          </>
            ) : (
              <div className="todo-input-container">
            <input
              type="text"
              placeholder="Enter your main problem statement..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addHeading() }}
              className="todo-input"
            />
            <button onClick={isProblem== null ? addHeading : addTodo} className="add-button">Add</button>
          </div>
            )
          )
        }


  

        

        {todos.length > 0 && (
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
        )}


            {isProblem
              &&(

            <div className="problem-buttons">
              <button onClick={clearProblem} className="solved-button">Resolved</button>
            </div>
              )
            }
        </div>
    </>
  );
};

export default Problem;