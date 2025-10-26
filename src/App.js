import React from 'react';
import './App.css';
import MData from './components/MData';
import TodoComponent from './components/TodoComponent';
import TilesComponent from './components/TilesComponent';
import { Route, Routes } from 'react-router-dom';
import Test from './components/Test';
import DynamicTable from './components/DynamicTable';
import AddRowComponent from './components/AddRowComponent';
import EditRowComponent from './components/EditRowComponent';
import { useEffect, useState } from 'react';
import EditableTable from './components/EditableTable';
import ImportLocalStorage from './components/ImportLocalStorage';
import Problem from './components/Problem';

function App() {

    const [isQuotesEnabled , setIsQuotesEnabled] = useState(true)

    


    const tiles = [
        { path: "/today", label: "Today" },
        { path: "/component-i", label: "IT" },
        { path: "/stock", label: "Stock" },
        { path: "/component-g2", label: "Gold" },
        { path: "/component-r", label: "Real" },
        // { path: "/component-m", label: "MF" },
         { path: "/importJson", label: "Import json" },
        { path: "/component-l", label: "Lending" },
    ];

    const todayTiles = [
        { path: "/component-bucket", label: "Bucket" },
        { path: "/component-t", label: "Today" },
        { path: "/component-problems", label: "Problems" },
        { path: "/learning", label: "Learning" },
        { path: "/focus", label: "Focus" },
        { path: "/goal", label: "Goal" },
        { path: "/personal-improvement", label: "Personal Improvement" },
        { path: "/mistake", label: "Mistake" },
        { path: "/quotes", label: "Motivation" },
        { path: "/productivity-task", label: "Productivity" },
        { path: "/component-want", label: "Wants" },
        { path: "/component-need", label: "Needs" },
        
        
        { path: "/family", label: "Family" },
    ];

    const stockTiles = [
        { path: "/component-s", label: "Stock" },
        { path: "/component-m", label: "MF" },
        // { path: "/component-l", label: "Lending" },
    ];

    const goalTiles = [
        { path: "/today-goal", label: "Today" },
        { path: "/week-goal", label: "Week" } ,
        { path: "/month-goal", label: "Month" },
    ];

    return (
        <div className="counter-app">
            <Routes>
                <Route path="/" element={<TilesComponent isQuotesEnabled tiles={tiles}/>} />
                <Route path="/today" element={<TilesComponent tiles={todayTiles} />} />
                <Route path="/stock" element={<TilesComponent tiles={stockTiles} />} />
                <Route path="/goal" element={<TilesComponent tiles={goalTiles}/>} />
                <Route path="/component-g2" element={<Test />} />
                <Route path="/component-s" element={<MData />} />
                <Route path="/component-r" element={<TodoComponent filter="real" name="R-Service"/>} />
                <Route path="/component-i" element={<TodoComponent filter="it" name="IT-Service"/>} />
                
                <Route path="/component-t" element={<TodoComponent filter="today" name="Today"/>} />
                <Route path="/component-b" element={<DynamicTable filter="bank" name="Bank"/>} />
                <Route path="/component-m" element={<DynamicTable filter="mf" name="MF"/>} />
                <Route path="//importJson" element={<ImportLocalStorage/>} />
                <Route path="/component-l" element={<DynamicTable filter="lending" name="Lending"/>} />
                <Route path="/add-row" element={<AddRowComponent name="Lending"/>} />
                <Route path="/doc-details" element={<EditableTable name="documents"/>} />
                <Route path="/edit-row" element={<EditRowComponent />} />
                {/* Additional Routes */}
                <Route path="/personal-improvement" element={<TodoComponent filter="personal-improvement" name="Improvement"/>} />
                <Route path="/learning" element={<TodoComponent filter="learning" name="Learning"/>} />
                <Route path="/mistake" element={<TodoComponent filter="mistake" name="Mistake"/>} />
                <Route path="/focus" element={<TodoComponent filter="focus" name="Focus"/>} />
                <Route path="/component-problems" element={<TodoComponent filter="problems" name="Tell me your Problems"/>} />  
                <Route path="/component-bucket" element={<TodoComponent filter="bucket" name="Bucket"/>} />   
                <Route path="/family" element={<TodoComponent filter="family" name="Family goal"/>} />
                
                <Route path="/quotes" element={<TodoComponent filter="quotes" name="Quotes"/>} /> 
                <Route path="/productivity-task" element={<TodoComponent filter="productivity-task" name="Productivity"/>} />
                <Route path="/component-need" element={<TodoComponent filter="needs" name="Needs"/>} />
                <Route path="/component-want" element={<TodoComponent filter="wants" name="Wants"/>} />



                {/* goal router */}
                <Route path="/today-goal" element={<TodoComponent filter="t-goal" name="Now"/>} />
                <Route path="/week-goal" element={<TodoComponent filter="w-goal" name="Week"/>} />
                <Route path="/month-goal" element={<TodoComponent filter="=m-goal" name="Month"/>} />


            </Routes>

            
        </div>
        
    );
}

export default App;
