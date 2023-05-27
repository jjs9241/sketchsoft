import React from 'react';
import './styles/App.css';
import RandomSphereViewer from './components/RandomSphereViewer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={process.env.PUBLIC_URL + '/logo.svg'} className="App-logo" alt="logo" /> */}
        <RandomSphereViewer></RandomSphereViewer>
      </header>
    </div>
  );
}

export default App;
