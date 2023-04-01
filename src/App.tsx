import React from 'react';
import './App.css';
import Administration from './Components/Administration';
import { createDataBase } from './Services/indexedDB';
import {useState} from 'react'
import Formular from './Components/Formular';

createDataBase()

function App() {
  const [toggleSearch,setToggleSearch]=useState<string>('Administration')
  return <>
  <button onClick={(e)=>{
    e.preventDefault()
    setToggleSearch('Administration')
  }}>Administration</button>
  <button onClick={(e)=>{
    e.preventDefault()
    setToggleSearch('Formular')
  }}>Formular</button>
  {toggleSearch==='Administration' &&<Administration toggleSearch={toggleSearch}/>}
  {toggleSearch==='Formular' &&<Formular toggleSearch={toggleSearch}/>}
  </>
}

export default App;
