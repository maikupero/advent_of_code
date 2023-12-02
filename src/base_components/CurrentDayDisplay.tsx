import '../styles/currentDayDisplay.css';
import reactLogo from '../assets/react.svg';
import { useState } from 'react';
import { DayType } from '../types/dayData';

const [revealAnswers, setRevealAnswers] = useState<boolean>(false);

const CurrentDayDisplay = (currentDay: DayType) => {
  return (
    <div className="dayBox">

      <div className="title">
        <h1>{currentDay.title}</h1>
      </div>

      <div className="exampleBox">
        <div className="exampleData">
          <p>{currentDay.exampleData}</p>
        </div>
        <div className="exampleImage">
          <a href="https://reactjs.org" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
      </div>
      
      <button className="answerBoxes" onClick={() => setRevealAnswers(true)}>
        <div className="part1">
          <h2>Part One</h2>
          <hr />
          <div className="answerBox">
            {!revealAnswers
              ? currentDay.gistA
              : currentDay.answerA
            }
          </div>
        </div>
        
        <div className="part2">
          <h2>Part Two</h2>
          <hr />
          <div className="answerBox">
            {!revealAnswers
              ? currentDay.gistB
              : currentDay.answerB
            }
          </div>
        </div>

      </button>
      {revealAnswers && 
        <div className="answerDetails">
          Char Count: {currentDay.answerDetails.dataCharCount}
          dataLineCount: {currentDay.answerDetails.dataLineCount}
          dataMinValue: {currentDay.answerDetails.dataMaxValue}
          dataMaxValue: {currentDay.answerDetails.dataMinValue}
        </div>
      }
    

    </div>
  );
}

export default CurrentDayDisplay;