import logo from './logo.svg';
import './App.css';
import ArrayComponent from './components/ArrayComponent'
import MData from './components/MData'

function App() {
  return (
    <div className="counter-app">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <MData />
    </div>
  );
}

export default App;
