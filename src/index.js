import React from 'react';
import ReactDOM from 'react-dom/client';
import WorkoutProgram from './WorkoutProgram.jsx';

// This finds the <div id="root"></div> in your public/index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// This tells React to render your WorkoutProgram component inside that div
root.render(
  <React.StrictMode>
    <WorkoutProgram />
  </React.StrictMode>
);