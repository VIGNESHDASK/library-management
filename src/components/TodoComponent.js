import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { MdContentCopy, MdDelete, MdDriveFileMove } from "react-icons/md";
import "../App.css";
import Scoreboard from "./Scoreboard";

// Helper to normalize a todo item to a plain string
const normalizeTodoItem = (item) => {
  if (item === null || item === undefined) return "";
  if (typeof item === "object") {
    // Object shape: { id, text, details, date } or similar
    return String(
      item.text ?? item.label ?? item.value ?? JSON.stringify(item)
    );
  }
  return String(item);
};

// Helper to normalize a todos array — ensures every element is a string
const normalizeTodos = (arr) => {
  if (!Array.isArray(arr)) return [];
  return arr.map(normalizeTodoItem);
};

// Custom hook for localStorage management
const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
};

// Custom hook for managing daily achievement count
const useDailyAchievementCount = (filter) => {
  const today = new Date().toLocaleDateString("en-CA"); // local date YYYY-MM-DD
  const [achievementData, setAchievementData] = useLocalStorage(
    `${filter}-achievements`,
    {
      date: today,
      count: 0,
    }
  );

  // Reset count if it's a new day
  const todayCount = achievementData.date === today ? achievementData.count : 0;

  const incrementCount = () => {
    setAchievementData({
      date: today,
      count: todayCount + 1,
    });
  };

  const resetCount = () => {
    setAchievementData({
      date: today,
      count: 0,
    });
  };

  return {
    todayCount,
    incrementCount,
    resetCount,
  };
};

// Custom hook for managing todo data
const useTodoData = (filter) => {
  const [rawTodos, setTodos] = useLocalStorage(filter, []);
  const [todoDetails, setTodoDetails] = useLocalStorage(
    `${filter}-details`,
    []
  );
  const [todoDates, setTodoDates] = useLocalStorage(`${filter}-dates`, []);

  // Normalize: if any stored item is an object {id, text, details, date},
  // extract its text so React can render it safely as a string.
  const todos = normalizeTodos(rawTodos);

  return {
    todos,
    setTodos,
    todoDetails,
    setTodoDetails,
    todoDates,
    setTodoDates,
  };
};

// Custom hook for cross-filter operations (bucket/today)
const useCrossFilterData = (filter) => {
  const [rawCrossFilterTodos, setCrossFilterTodos] = useLocalStorage(
    filter === "bucket" ? "today" : "bucket",
    []
  );
  const [crossFilterTodoDetails, setCrossFilterTodoDetails] = useLocalStorage(
    filter === "bucket" ? "today-details" : "bucket-details",
    []
  );
  const [crossFilterTodoDates, setCrossFilterTodoDates] = useLocalStorage(
    filter === "bucket" ? "today-dates" : "bucket-dates",
    []
  );

  const crossFilterTodos = normalizeTodos(rawCrossFilterTodos);

  return {
    crossFilterTodos,
    setCrossFilterTodos,
    crossFilterTodoDetails,
    setCrossFilterTodoDetails,
    crossFilterTodoDates,
    setCrossFilterTodoDates,
  };
};

// Custom hook for problem-solving placeholder logic
const useProblemPlaceholder = (todosLength, isProblem) => {
  const [placeholder, setPlaceholder] = useState("Write the first step...");

  const placeholderTexts = [
    "Write the first step...",
    "What's the next action?",
    "Describe a solution...",
    "Add a task to tackle this...",
    "Break it down into a step...",
  ];

  useEffect(() => {
    if (!isProblem) {
      setPlaceholder(placeholderTexts[0]);
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
      .find((threshold) => todosLength >= parseInt(threshold));

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
      onKeyDown={(e) => {
        if (e.key === "Enter") onAdd();
      }}
      className="todo-input"
    />
    <button onClick={onAdd} className="add-button">
      Add
    </button>
  </div>
);

// Component for todo input
const TodoInput = ({
  inputValue,
  setInputValue,
  onAdd,
  placeholder,
  name,
  isProblem,
  isHeading,
}) => {
  if (isProblem && !isHeading) {
    return (
      <ProblemHeadingInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        onAdd={onAdd}
      />
    );
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
          onKeyDown={(e) => {
            if (e.key === "Enter") onAdd();
          }}
          className="todo-input"
        />
        <button onClick={onAdd} className="add-button">
          Add
        </button>
      </div>
    </>
  );
};

// Component for todo item actions
const TodoItemActions = ({
  index,
  isBucket,
  isToday,
  expandedIndex,
  onMove,
  onRemove,
}) => {
  if (expandedIndex === index) return null;

  if (isBucket || isToday) {
    return (
      <div className="button-icon" style={{ display: "flex", gap: "0.5rem" }}>
        <MdDriveFileMove
          onClick={() => onMove(index)}
          size={30}
          className="move-icon"
        />
        <MdDelete
          onClick={() => onRemove(index)}
          size={30}
          className="delete-icon"
        />
      </div>
    );
  }

  return (
    <button onClick={() => onRemove(index)} className="remove-button">
      Remove
    </button>
  );
};

// Component for expanded todo details
const TodoDetails = ({
  index,
  todoDetails,
  todoDates,
  onDetailChange,
  onDateChange,
}) => (
  <div className="todo-details">
    <textarea
      value={todoDetails[index] || ""}
      onChange={(e) => onDetailChange(e, index)}
      placeholder="Edit todo details..."
      className="todo-detail-input"
    />
    <input
      type="date"
      value={todoDates[index] || new Date().toISOString().split("T")[0]}
      onChange={(e) => onDateChange(e, index)}
      className="date-input"
    />
  </div>
);

const ReportDisplay = ({ report }) => {
  const onCopy = () => {
    // Create a plain text version of the report.
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
      .then(() => {
        console.log("Report copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy report: ", err);
      });
  };

  return (
    <div className="todo-container report-container">
      <div className="copy-buttons">
        <button onClick={onCopy} title="Copy Report">
          <MdContentCopy size={20} />
        </button>
      </div>
      <div className="report-header"></div>
      <div className="report-content">
        <div className="report-section">
          <p className="problem-text">{report.heading}</p>
        </div>
        <div className="report-section">
          <ol className="solutions-list">
            {report.solutions.map((solution, index) => (
              <li key={index} className="solution-item">
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
  // State management
  const [inputValue, setInputValue] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isHeading, setIsHeading] = useLocalStorage("problem-heading", "");
  const [reportGenerated, setReportGenerated] = useState(false);
  const [report, setReport] = useState(null);

  // Derived state
  const isBucket = filter === "bucket";
  const isToday = filter === "today";
  const isProblem = filter === "problems";

  // Custom hooks
  const {
    todos,
    setTodos,
    todoDetails,
    setTodoDetails,
    todoDates,
    setTodoDates,
  } = useTodoData(filter);
  const crossFilterData = useCrossFilterData(filter);
  const placeholder = useProblemPlaceholder(todos.length, isProblem);
  const { todayCount, incrementCount, resetCount } =
    useDailyAchievementCount(filter);

  // Event handlers
  const addTodo = () => {
    if (inputValue.trim() !== "") {
      const newTodo = inputValue.trim();
      setTodos([newTodo, ...todos]);
      setTodoDetails(["", ...todoDetails]);
      setTodoDates([new Date().toISOString().split("T")[0], ...todoDates]);
      setInputValue("");
      // Prepending shifts all existing indices by 1; keep expandedIndex on the same item
      if (expandedIndex !== null) {
        setExpandedIndex(expandedIndex + 1);
      }
    }
  };

  const addHeading = () => {
    if (inputValue.trim() !== "") {
      setIsHeading(inputValue.trim());
      setInputValue("");
    }
  };

  const removeTodo = (index) => {
    const confirm = window.confirm("Confirm to Remove from List.");
    if (!confirm) return;

    const newTodos = todos.filter((_, i) => i !== index);
    const newDetails = todoDetails.filter((_, i) => i !== index);
    const newDates = todoDates.filter((_, i) => i !== index);

    setTodos(newTodos);
    setTodoDetails(newDetails);
    setTodoDates(newDates);
    setExpandedIndex(null);

    // Increment achievement count when todo is removed
    incrementCount();
  };

  const moveTodo = (index) => {
    const {
      setCrossFilterTodos,
      setCrossFilterTodoDetails,
      setCrossFilterTodoDates,
    } = crossFilterData;

    // Read directly from localStorage to avoid stale state from deferred useEffect writes
    const destKey = filter === "bucket" ? "today" : "bucket";
    const destDetailsKey =
      filter === "bucket" ? "today-details" : "bucket-details";
    const destDatesKey = filter === "bucket" ? "today-dates" : "bucket-dates";

    const destTodos = (() => {
      try {
        return JSON.parse(localStorage.getItem(destKey)) || [];
      } catch {
        return [];
      }
    })();
    const destDetails = (() => {
      try {
        return JSON.parse(localStorage.getItem(destDetailsKey)) || [];
      } catch {
        return [];
      }
    })();
    const destDates = (() => {
      try {
        return JSON.parse(localStorage.getItem(destDatesKey)) || [];
      } catch {
        return [];
      }
    })();

    const updatedTodos = [...destTodos, todos[index]];
    const updatedDetails = [...destDetails, todoDetails[index]];
    const updatedDates = [...destDates, todoDates[index]];

    // Write all three atomically so destination always reads consistent data
    localStorage.setItem(destKey, JSON.stringify(updatedTodos));
    localStorage.setItem(destDetailsKey, JSON.stringify(updatedDetails));
    localStorage.setItem(destDatesKey, JSON.stringify(updatedDates));

    setCrossFilterTodos(updatedTodos);
    setCrossFilterTodoDetails(updatedDetails);
    setCrossFilterTodoDates(updatedDates);

    // Remove from current list
    const newTodos = todos.filter((_, i) => i !== index);
    const newDetails = todoDetails.filter((_, i) => i !== index);
    const newDates = todoDates.filter((_, i) => i !== index);

    setTodos(newTodos);
    setTodoDetails(newDetails);
    setTodoDates(newDates);
    setExpandedIndex(null);

    // Increment achievement count when todo is moved
    incrementCount();
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

  const clearProblem = () => {
    if (isHeading !== "") {
      setIsHeading("");
      setTodos([]);
      setTodoDetails([]);
      setTodoDates([]);
    }
  };

  const generateReport = () => {
    const reportData = {
      heading: isHeading,
      solutions: todos.map((todo, index) => ({
        text: todo,
        details: todoDetails[index],
        date: todoDates[index],
      })),
    };

    setReport(reportData);
    setReportGenerated(true);
  };

  const handleAdd = isProblem && !isHeading ? addHeading : addTodo;

  return (
    <>
      <Scoreboard
        score={todayCount}
        bucketCompleted={filter === "bucket" ? todayCount : undefined}
        bucketRemaining={filter === "bucket" ? todos.length : undefined}
        todayCompleted={filter === "today" ? todayCount : undefined}
        todayRemaining={filter === "today" ? todos.length : undefined}
      />

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
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="todo-list"
              >
                {todos.map((todo, index) => (
                  <Draggable
                    key={index}
                    draggableId={index.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <li
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className="todo-item"
                      >
                        <span className="todo-number">{index + 1}.</span>
                        <span
                          onClick={() => toggleTodoDetails(index)}
                          className="todo-text"
                        >
                          {todo}
                        </span>

                        <TodoItemActions
                          index={index}
                          isBucket={isBucket}
                          isToday={isToday}
                          expandedIndex={expandedIndex}
                          onMove={moveTodo}
                          onRemove={removeTodo}
                        />

                        {expandedIndex === index && (
                          <TodoDetails
                            index={index}
                            todoDetails={todoDetails}
                            todoDates={todoDates}
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
          <div className="problem-buttons">
            <button onClick={generateReport} className="solved-button">
              Report
            </button>
            <button onClick={clearProblem} className="solved-button">
              Resolved
            </button>
          </div>
        )}
      </div>

      {reportGenerated && (
        <div className="todo-container">
          <ReportDisplay report={report} />
        </div>
      )}
    </>
  );
};

export default TodoComponent;

