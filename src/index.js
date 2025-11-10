import './index.css'; // <-- ADD THIS LINE

import React from 'react';
import ReactDOM from 'react-dom/client';
import WorkoutProgram from './WorkoutProgram.jsx';

// ... rest of your index.js file ...

// This finds the <div id="root"></div> in your public/index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// This tells React to render your WorkoutProgram component inside that div
root.render(
  <React.StrictMode>
    <WorkoutProgram />
  </React.StrictMode>
);