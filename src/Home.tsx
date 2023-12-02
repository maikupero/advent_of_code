import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './Home.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import NavBar from './base_components/NavBar';
import CurrentDayDisplay from './base_components/CurrentDayDisplay';
import NextIndicator from './base_components/NextIndicator';
import PreviousIndicator from './base_components/PreviousIndicator';
import Footer from './base_components/Footer';
import { DayType } from './types/dayData';

const mockCurrentDay: DayType = {
  title: "Day 1",
  exampleData: `1000
  2000
  3000
  
  4000
  
  5000
  6000
  
  7000
  8000
  9000
  
  10000`,
  gistA: "Fat elves",
  answerA: "39568306",
  gistB: "Fat elves",
  answerB: "39568306",
  answerDetails: {
    dataCharCount: 10,
    dataLineCount: 10,
    dataMinValue: 0,
    dataMaxValue: 9
  }
};

const Home = () => {
  const [currentDay, setCurrentDay] = useState(1)

  return (    
    <div className="home">
      <NavBar />
      <div className="mainDisplay">
        <PreviousIndicator />
        <CurrentDayDisplay currentDay={mockCurrentDay} />
        <NextIndicator />
      </div>
      <Footer />
    </div>
  )
}
{/*
  <Router>
    <Routes>
      <Route path="/1" element={<DayBlock brands={day1}/>} />
    </Routes>
  </Router> 
*/}

export default Home;