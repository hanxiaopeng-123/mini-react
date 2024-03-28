import React from "./core/React.js"
import {update} from './core/ReactDom.js'
  // const  App=createElement("div",{id:"app"},'22')
  let a=1
  function Counter({num}){
    const onclick=()=>{
      console.log(111);
      a++
      update()
    }
    return(<div>111 {num} <button onClick={onclick}>click {a}</button></div>) 
  }

  function  App(){
    return (<div id="app">xxxx<Counter  num={10} ></Counter>333</div>)
  }
  export default App