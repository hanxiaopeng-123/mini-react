import React from "./core/React.js"
  // const  App=createElement("div",{id:"app"},'22')
  function Counter({num}){
    return <div>111 {num}</div>
  }
  function CounterContainer(){
    return <Counter></Counter>
  }
  function  App(){
    return (<div id="app">xxxx<Counter  num={10} ></Counter> <Counter num={20}></Counter>333</div>)
  }
  export default App