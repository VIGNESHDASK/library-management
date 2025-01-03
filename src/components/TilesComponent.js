// Import necessary modules
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import '../App.css'; // Ensure to style appropriately

// Define the individual components to navigate to
const ComponentOne = () => <div>Component One</div>;
const ComponentTwo = () => <div>Component Two</div>;
const ComponentThree = () => <div>Component Three</div>;
const ComponentFour = () => <div>Component Four</div>;
const ComponentFive = () => <div>Component five</div>;


// Define the Main Tiles Component
const TilesComponent = () => {
    return (
        <div className="tiles-container">
            <Link to="/component-one" className="tile">G Service</Link>
            <Link to="/component-two" className="tile">S Service</Link>
            <Link to="/component-three" className="tile">R Service</Link>
            <Link to="/component-four" className="tile">I Service</Link>
            <Link to="/component-five" className="tile">Todo</Link>
        </div>
    );
};



export default TilesComponent;
