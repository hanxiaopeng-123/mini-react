import React from "./core/React.js"
import {update,useState,useEffect} from './core/ReactDom.js'
  // const  App=createElement("div",{id:"app"},'22')
  let a=1

  let show=false
  function Counter({num}){
  
    let [count,setCount]=useState(0)
    
    let [bar,setBar]=useState('bar')
    useEffect(()=>{
      console.log('useEffect-count');
      return ()=>{
        console.log('cleanup-count');
      }
    },[count])
    useEffect(()=>{
      console.log('useEffect-bar');
      return ()=>{
        console.log('cleanup-bar');
      }
    },[bar])
    const update2=update()
    console.log('Counter');
    // const Foo=()=>{
    //   return (<div id="foo"><div>foo</div><div>child1</div></div>)
    // }
    // const foo=(<div>foo</div>)
    const onclick=()=>{
      setCount((count)=>  count+1)
    }
    const onclickBar=()=>{
      setBar('barbarbar')
    }
    const showBar=()=>{
      show=!show
      update2()
    }
    return(<div>111 {num} -count:{count}-bar:{bar}
     <button onClick={onclick}>click count</button>
     <button onClick={onclickBar}>click bar</button>
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