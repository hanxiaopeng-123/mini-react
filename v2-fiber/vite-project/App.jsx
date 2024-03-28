import React from "./core/React.js"
import {update} from './core/ReactDom.js'
  // const  App=createElement("div",{id:"app"},'22')
  let a=1

  let show=false
  function Counter({num}){
    const update2=update()
    console.log('Counter');
    const Foo=()=>{
      return (<div id="foo"><div>foo</div><div>child1</div></div>)
    }
    const foo=(<div>foo</div>)
    const bar=(<div> bar  <div>child2</div><div>child3</div></div> )
    const onclick=()=>{
      a++
      update2()
    }
    const showBar=()=>{
      show=!show
      update2()
    }
    return(<div>111 {num} 
     <button onClick={onclick}>click {a}</button>
    {show&&bar}
    <button onClick={showBar}>showBar </button>
    </div>) 
  
  }
  function Counter2({num}){
    console.log('Counter2');
    const update2=update()
    const Foo=()=>{
      return (<div id="foo"><div>foo</div><div>child1</div></div>)
    }
    const foo=(<div>foo</div>)
    const bar=(<div> bar  <div>child2</div><div>child3</div></div> )
    const onclick=()=>{
      a++
      update2()
    }
    const showBar=()=>{
      show=!show
      update2()
    }
    return(<div>111 {num} 
     <button onClick={onclick}>click {a}</button>
    {show&&bar}
    <button onClick={showBar}>showBar </button>
    </div>) 
  }

  function  App(){
    return (<div id="app"><Counter  num={10} ></Counter> <Counter2  num={20} ></Counter2></div>)
  }
  export default App