import React from 'react';
import '../App.css';

const Scoreboard = ({ score }) => {
  // Define the objectMapper as an array of objects
  const objectMapper = [
    {score : 1 , message: "good to go"} ,
    { score: 3, message: "try now" },
    { score: 5, message: "try to finish within 1 hour" },
    { score: 10, message: "keep in mind Pansons law" }
  ];

  // Find the closest lower or equal message for the given score
  const result = objectMapper.reverse().find(item => score >= item.score)?.message || "Try new manh";


  return (
    <div className='score'>
      score: {score} || Result: {result} 
    </div>
  );
};

export default Scoreboard;
