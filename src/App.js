import React from 'react';
import './App.css';
import ArrayComponent from './components/ArrayComponent';
import MData from './components/MData';
import TodoComponent from './components/TodoComponent';

import TilesComponent from './components/TilesComponent';
import { Route, Routes } from 'react-router-dom';
import Test from './components/Test';

// Define the individual components to navigate to
const ComponentOne = () => <div>Component One</div>;
const ComponentThree = () => <div>Component Three</div>;
const ComponentFour = () => <div>Component Four</div>;
const ComponentFive = () => <div>Component Five</div>;


function App() {
  return (
    <div className="counter-app">
      <Routes>
        <Route path="/" element={<TilesComponent />} />
        <Route path="/component-one" element={<Test />} />
        <Route path="/component-two" element={<MData />} />
        <Route path="/component-three" element={<TodoComponent filter="real"/>} />
        <Route path="/component-four" element={<TodoComponent filter="it"/>} />
        <Route path="/component-five" element={<TodoComponent filter="todos"/>} />
      </Routes>
    </div>
  );
}

export default App;
