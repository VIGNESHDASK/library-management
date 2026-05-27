import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import '../App.css';
import Scoreboard from './Scoreboard';
import { MdDelete, MdDriveFileMove, MdContentCopy } from "react-icons/md";

// Helper to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

// Custom hook for localStorage management
const useLocalStorage = (key, initialValue) => {
  const [value, setValueState] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (newValue) => {
    try {
      const valueToStore = typeof newValue === 'function' ? newValue(value) : newValue;
      localStorage.setItem(key, JSON.stringify(valueToStore));
      setValueState(valueToStore);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [value, setValue];
};

// Custom hook for managing daily achievement count
const useDailyAchievementCount = (filter) => {
  const today = new Date().toISOString().split('T')[0];
  const [achievementData, setAchievementData] = useLocalStorage(`${filter}-achievements`, {
    date: today,
    count: 0
  });

  const todayCount = achievementData.date === today ? achievementData.count : 0;

  const incrementCount = () => {
    setAchievementData({
      date: today,
      count: todayCount + 1
    });
  };

  return { todayCount, incrementCount };
};

// Custom hook for managing unified todo items with Backward Compatibility Migration Layer
const useTodoData = (filter) => {
  const [rawTodos, setRawTodos] = useLocalStorage(filter, []);

  // Migration logic: If any todo item is a pure string, safely convert the whole list to objects
  const todos = React.useMemo(() => {
    if (!Array.isArray(rawTodos)) return [];
    
    const needsMigration = rawTodos.some(todo => typeof todo === 'string');
    
    if (needsMigration) {
      // Pull historical details and dates arrays from old keys
      let savedDetails = [];
      let savedDates = [];
      try {
        const detailsItem = localStorage.getItem(`${filter}-details`);
        const datesItem = localStorage.getItem(`${filter}-dates`);
        if (detailsItem) savedDetails = JSON.parse(detailsItem);
        if (datesItem) savedDates = JSON.parse(datesItem);
      } catch (e) {
        console.error("Failed to parse old details/dates during migration", e);
      }

      // Convert pure strings to unified objects matching old indexes
      const migrated = rawTodos.map((todo, index) => {
        if (typeof todo === 'string') {
          return {
            id: generateId(),
            text: todo,
            details: savedDetails[index] || '',
            date: savedDates[index] || new Date().toISOString().split('T')[0]
          };
        }
        return todo; // Already an object
      });

      // Synchronize the converted data permanently back into localStorage
      setTimeout(() => {
        setRawTodos(migrated);
      }, 0);

      return migrated;
    }

    return rawTodos;
  }, [rawTodos, filter]);

  return { todos, setTodos: setRawTodos };
};

// Custom hook for problem-solving placeholder logic
const useProblemPlaceholder = (todosLength, isProblem) => {
  const [placeholder, setPlaceholder] = useState("Write the first step...");

  useEffect(() => {
    if (!isProblem) {
      setPlaceholder("Write the first step...");
      return;
    }

    const placeholderMap = {
      0: "Start Thinking...",
      3: "Common people do...",
      5: "Think Roi ...",
      9: "Different perspective...",
      12: "Brainstorming...",
      14: "Seek the excellence...",
    };

    const applicablePlaceholder = Object.keys(placeholderMap)
      .reverse()
      .find(threshold => todosLength >= parseInt(threshold));

    if (applicablePlaceholder) {
      setPlaceholder(placeholderMap[applicablePlaceholder]);
    }
  }, [todosLength, isProblem]);

  return placeholder;
};

// Component for problem heading input
const ProblemHeadingInput = ({ inputValue, setInputValue, onAdd }) => (
  <div className="todo-input-container">
    <input
      type="text"
      placeholder="Enter your main problem statement..."
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={(e) => { if (e.key === 'Enter') onAdd(); }}
      className="todo-input"
    />
    <button onClick={onAdd} className="add-button">Add</button>
  </div>
);

// Component for todo input
const TodoInput = ({ inputValue, setInputValue, onAdd, placeholder, name, isProblem, isHeading }) => {
  if (isProblem && !isHeading) {
    return <ProblemHeadingInput inputValue={inputValue} setInputValue={setInputValue} onAdd={onAdd} />;
  }

  return (
    <>
      {isProblem ? (
        <h5>{`how I can solve: ${isHeading} Problem`}</h5>
      ) : (
        <h1>{name}</h1>
      )}
      <div className="todo-input-container">
        <input
          type="text"
          placeholder={isProblem ? placeholder : "Add a new todo..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onAdd(); }}
          className="todo-input"
        />
        <button onClick={onAdd} className="add-button">Add</button>
      </div>
    </>
  );
};

// Component for todo item actions
const TodoItemActions = ({ id, isBucket, isToday, expandedId, onMove, onRemove }) => {
  if (expandedId === id) return null;

  if (isBucket || isToday) {
    return (
      <div className='button-icon' style={{ display: 'flex', gap: '0.5rem' }}>
        <MdDriveFileMove onClick={() => onMove(id)} size={30} className="move-icon" />
        <MdDelete onClick={() => onRemove(id)} size={30} className="delete-icon" />
      </div>
    );
  }

  return (
    <button onClick={() => onRemove(id)} className="remove-button">
      Remove
    </button>
  );
};

// Component for expanded todo details
const TodoDetails = ({ todo, onDetailChange, onDateChange }) => (
  <div className="todo-details">
    <textarea
      value={todo.details || ''}
      onChange={(e) => onDetailChange(e, todo.id)}
      placeholder="Edit todo details..."
      className="todo-detail-input"
    />
    <input
      type="date"
      value={todo.date || new Date().toISOString().split('T')[0]}
      onChange={(e) => onDateChange(e, todo.id)}
      className="date-input"
    />
  </div>
);

const ReportDisplay = ({ report }) => {
  const onCopy = () => {
    let reportText = `\n${report.heading}\n\n`;
    reportText += `Solutions & Action Items:\n`;

    report.solutions.forEach((solution, index) => {
      reportText += `${index + 1}. ${solution.text}\n`;
      if (solution.details) {
        reportText += `   Details: ${solution.details}\n`;
      }
      reportText += `\n`;
    });

    navigator.clipboard
      .writeText(reportText)
      .then(() => console.log("Report copied to clipboard"))
      .catch((err) => console.error("Failed to copy report: ", err));
  };

  return (
    <div className="todo-container report-container">
      <div className="copy-buttons">
        <button onClick={onCopy} title="Copy Report">
          <MdContentCopy size={20} />
        </button>
      </div>
      <div className="report-content">
        <div className="report-section">
          <p className="problem-text">{report.heading}</p>
        </div>
        <div className="report-section">
          <ol className="solutions-list">
            {report.solutions.map((solution, index) => (
              <li key={solution.id || index} className="solution-item">
                <span className="solution-text">{solution.text}</span>
                {solution.details && (
                  <div className="solution-details">
                    <strong>Details:</strong> {solution.details}
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

const TodoComponent = ({ filter, name }) => {
  const [inputValue, setInputValue] = useState('');
  const [expandedId, setExpandedId] = useState(null); 
  const [isHeading, setIsHeading] = useLocalStorage('problem-heading', '');
  const [reportGenerated, setReportGenerated] = useState(false);
  const [report, setReport] = useState(null);

  const isBucket = filter === "bucket";
  const isToday = filter === "today";
  const isProblem = filter === "problems";

  const { todos, setTodos } = useTodoData(filter);
  const placeholder = useProblemPlaceholder(todos.length, isProblem);
  const { todayCount, incrementCount } = useDailyAchievementCount(filter);

  const crossFilterKey = filter === "bucket" ? "today" : "bucket";

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodoItem = {
        id: generateId(),
        text: inputValue.trim(),
        details: '',
        date: new Date().toISOString().split('T')[0]
      };
      setTodos([newTodoItem, ...todos]);
      setInputValue('');
    }
  };

  const addHeading = () => {
    if (inputValue.trim() !== '') {
      setIsHeading(inputValue.trim());
      setInputValue('');
    }
  };

  const removeTodo = (id) => {
    if (!window.confirm('Confirm to Remove from List.')) return;

    setTodos(todos.filter(todo => todo.id !== id));
    if (expandedId === id) setExpandedId(null);
    incrementCount();
  };

  const moveTodo = (id) => {
    const targetItem = todos.find(todo => todo.id === id);
    if (!targetItem) return;

    try {
      const existingCrossData = localStorage.getItem(crossFilterKey);
      let crossTodos = existingCrossData ? JSON.parse(existingCrossData) : [];
      
      // Safety fix: If the cross-filter target list also contains legacy strings, clean it up right here
      if (crossTodos.some(t => typeof t === 'string')) {
        crossTodos = crossTodos.map((t, idx) => typeof t === 'string' ? { id: generateId(), text: t, details: '', date: new Date().toISOString().split('T')[0] } : t);
      }

      localStorage.setItem(crossFilterKey, JSON.stringify([...crossTodos, targetItem]));
    } catch (e) {
      console.error("Failed cross filter move operations", e);
    }

    setTodos(todos.filter(todo => todo.id !== id));
    if (expandedId === id) setExpandedId(null);
    incrementCount();
  };

  const toggleTodoDetails = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDetailChange = (e, id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, details: e.target.value } : todo));
  };

  const handleDateChange = (e, id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, date: e.target.value } : todo));
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTodos(items);
  };

  const clearProblem = () => {
    if (isHeading !== '') {
      setIsHeading('');
      setTodos([]);
    }
  };

  const generateReport = () => {
    setReport({
      heading: isHeading,
      solutions: todos
    });
    setReportGenerated(true);
  };

  const handleAdd = isProblem && !isHeading ? addHeading : addTodo;

  return (
    <>
      <Scoreboard score={todayCount} />
      
      <div className="todo-container">
        <TodoInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          onAdd={handleAdd}
          placeholder={placeholder}
          name={name}
          isProblem={isProblem}
          isHeading={isHeading}
        />
        
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="todos">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef} className="todo-list">
                {todos.map((todo, index) => (
                  <Draggable key={todo.id} draggableId={todo.id} index={index}>
                    {(provided) => (
                      <li
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className="todo-item"
                      >
                        <span className="todo-number">{index + 1}.</span>
                        <span onClick={() => toggleTodoDetails(todo.id)} className="todo-text">
                          {todo.text}
                        </span>
                        
                        <TodoItemActions
                          id={todo.id}
                          isBucket={isBucket}
                          isToday={isToday}
                          expandedId={expandedId}
                          onMove={moveTodo}
                          onRemove={removeTodo}
                        />
                        
                        {expandedId === todo.id && (
                          <TodoDetails
                            todo={todo}
                            onDetailChange={handleDetailChange}
                            onDateChange={handleDateChange}
                          />
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

        {isProblem && (
          <div className='problem-buttons'>
            <button onClick={generateReport} className="solved-button">Report</button>
            <button onClick={clearProblem} className="solved-button">Resolved</button>
          </div>
        )}
      </div>

      {reportGenerated && report && (
        <div className="todo-container">
          <ReportDisplay report={report}/>
        </div>
      )}
    </>
  );
};

export default TodoComponent;
