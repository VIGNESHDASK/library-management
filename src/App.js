
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import AddRowComponent from "./components/AddRowComponent";
import DynamicTable from "./components/DynamicTable";
import EditableTable from "./components/EditableTable";
import EditRowComponent from "./components/EditRowComponent";
import ImportLocalStorage from "./components/ImportLocalStorage";
import MData from "./components/MData";
import CalculatorComponent from "./components/CalculatorComponent";
import BankComponent from "./components/BankComponent";
import PasswordManagerComponent from "./components/PasswordManagerComponent";
import SettingsComponent from "./components/SettingsComponent";
import SyncComponent from "./components/SyncComponent";
import Test from "./components/Test";
import TilesComponent from "./components/TilesComponent";
import TodoComponent from "./components/TodoComponent";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true";
  });

  // Apply dark mode class to body element
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const tiles = [
    { path: "/today", label: "Today" },
    { path: "/it", label: "IT" },
    { path: "/stock", label: "Stock" },
    { path: "/gold", label: "Gold" },
    { path: "/real", label: "Real" },
    { path: "/lending", label: "Lending" },
    { path: "/password-manager", label: "Manager" },
    { path: "/component-problems", label: "Solitude" },
    { path: "/settings", label: "Settings" },
  ];

  const todayTiles = [
    { path: "/component-bucket", label: "Bucket" },
    { path: "/component-t", label: "Today" },
    { path: "/mistake", label: "Mistake" },
    { path: "/learning", label: "Learning" },
    { path: "/focus", label: "Focus" },
    { path: "/goal", label: "Goal" },
    { path: "/personal-improvement", label: "Personal Improvement" },
    { path: "/quotes", label: "Motivation" },
    { path: "/family", label: "Family" },
  ];

  const stockTiles = [
    { path: "/component-s", label: "Stock" },
    { path: "/component-m", label: "MF" },
    { path: "/calculator", label: "Calculator" },
    { path: "/stock-mistake", label: "Mistake" },
    { path: "/stock-learning", label: "Learning" },
  ];

  const itTiles = [
    { path: "/component-i-main", label: "IT Service" },
    { path: "/it-mistake", label: "Mistake" },
    { path: "/it-learning", label: "Learning" },
  ];

  const goldTiles = [
    { path: "/component-g2-main", label: "Gold Service" },
    { path: "/gold-mistake", label: "Mistake" },
    { path: "/gold-learning", label: "Learning" },
  ];

  const realTiles = [
    { path: "/component-r-main", label: "Real Service" },
    { path: "/real-mistake", label: "Mistake" },
    { path: "/real-learning", label: "Learning" },
  ];

  const lendingTiles = [
    { path: "/component-l-main", label: "Lending Service" },
    { path: "/bank", label: "Bank" },
    { path: "/mutual-fund", label: "mutual-fund" },
    { path: "/lending-mistake", label: "Mistake" },
    { path: "/lending-learning", label: "Learning" },
  ];

  const goalTiles = [
    { path: "/today-goal", label: "Today" },
    { path: "/week-goal", label: "Week" },
    { path: "/month-goal", label: "Month" },
  ];

  return (
    <div className="counter-app">
      <Routes>
        <Route path="/" element={<TilesComponent tiles={tiles} />} />
        <Route path="/today" element={<TilesComponent tiles={todayTiles} />} />
        <Route path="/stock" element={<TilesComponent tiles={stockTiles} />} />
        <Route path="/it" element={<TilesComponent tiles={itTiles} />} />
        <Route path="/gold" element={<TilesComponent tiles={goldTiles} />} />
        <Route path="/real" element={<TilesComponent tiles={realTiles} />} />
        <Route
          path="/lending"
          element={<TilesComponent tiles={lendingTiles} />}
        />
        <Route path="/goal" element={<TilesComponent tiles={goalTiles} />} />
        <Route
          path="/settings"
          element={
            <SettingsComponent
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />
        <Route path="/sync" element={<SyncComponent />} />

        {/* Password Manager route */}
        <Route
          path="/password-manager"
          element={<PasswordManagerComponent />}
        />

        {/* Stock section routes */}
        <Route path="/component-s" element={<MData />} />
        <Route path="/calculator" element={<CalculatorComponent />} />
        <Route
          path="/component-m"
          element={<DynamicTable filter="mf" name="MF" />}
        />
        <Route
          path="/stock-mistake"
          element={
            <TodoComponent filter="stock-mistake" name="Stock Mistakes" />
          }
        />
        <Route
          path="/stock-learning"
          element={
            <TodoComponent filter="stock-learning" name="Stock Learning" />
          }
        />

        <Route
          path="/it-mistake"
          element={<TodoComponent filter="it-mistake" name="IT Mistakes" />}
        />
        <Route
          path="/it-learning"
          element={<TodoComponent filter="it-learning" name="IT Learning" />}
        />

        {/* Gold section routes */}
        <Route path="/component-g2-main" element={<Test />} />
        <Route
          path="/gold-mistake"
          element={<TodoComponent filter="gold-mistake" name="Gold Mistakes" />}
        />
        <Route
          path="/gold-learning"
          element={
            <TodoComponent filter="gold-learning" name="Gold Learning" />
          }
        />

        {/* Real section routes */}
        <Route
          path="/component-r-main"
          element={<TodoComponent filter="real" name="R-Service" />}
        />
        <Route
          path="/real-mistake"
          element={
            <TodoComponent filter="real-mistake" name="Real Estate Mistakes" />
          }
        />
        <Route
          path="/real-learning"
          element={
            <TodoComponent filter="real-learning" name="Real Estate Learning" />
          }
        />

        {/* Lending section routes */}
        <Route
          path="/component-l-main"
          element={<DynamicTable filter="lending" name="Lending" />}
        />
        <Route path="/bank" element={<BankComponent headLine="Bank" />} />
        <Route
          path="/mutual-fund"
          element={<BankComponent headLine="Mutual Fund" />}
        />
        <Route
          path="/lending-mistake"
          element={
            <TodoComponent filter="lending-mistake" name="Lending Mistakes" />
          }
        />
        <Route
          path="/lending-learning"
          element={
            <TodoComponent filter="lending-learning" name="Lending Learning" />
          }
        />

        {/* Legacy routes for backward compatibility */}
        <Route path="/component-g2" element={<Test />} />
        <Route
          path="/component-r"
          element={<TodoComponent filter="real" name="R-Service" />}
        />
        <Route
          path="/component-i"
          element={<TodoComponent filter="it" name="IT-Service" />}
        />
        <Route
          path="/component-l"
          element={<DynamicTable filter="lending" name="Lending" />}
        />

        <Route
          path="/component-t"
          element={<TodoComponent filter="today" name="Today" />}
        />
        <Route
          path="/component-b"
          element={<DynamicTable filter="bank" name="Bank" />}
        />
        <Route path="//importJson" element={<ImportLocalStorage />} />
        <Route path="/add-row" element={<AddRowComponent name="Lending" />} />
        <Route
          path="/doc-details"
          element={<EditableTable name="documents" />}
        />
        <Route path="/edit-row" element={<EditRowComponent />} />
        {/* Additional Routes */}
        <Route
          path="/personal-improvement"
          element={
            <TodoComponent filter="personal-improvement" name="Improvement" />
          }
        />
        <Route
          path="/learning"
          element={<TodoComponent filter="learning" name="Learning" />}
        />
        <Route
          path="/mistake"
          element={<TodoComponent filter="mistake" name="Mistake" />}
        />
        <Route
          path="/focus"
          element={<TodoComponent filter="focus" name="Focus" />}
        />
        <Route
          path="/component-problems"
          element={
            <TodoComponent filter="problems" name="Tell me your Problems" />
          }
        />
        <Route
          path="/component-bucket"
          element={<TodoComponent filter="bucket" name="Bucket" />}
        />
        <Route
          path="/family"
          element={<TodoComponent filter="family" name="Family goal" />}
        />

        <Route
          path="/quotes"
          element={<TodoComponent filter="quotes" name="Quotes" />}
        />

        {/* goal router */}
        <Route
          path="/today-goal"
          element={<TodoComponent filter="t-goal" name="Now" />}
        />
        <Route
          path="/week-goal"
          element={<TodoComponent filter="w-goal" name="Week" />}
        />
        <Route
          path="/month-goal"
          element={<TodoComponent filter="=m-goal" name="Month" />}
        />
      </Routes>
    </div>
  );
}

export default App;
