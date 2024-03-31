import React from "./core/React.js"
import { update, useState, useEffect } from './core/ReactDom.js'
import './style.css'
function Todolist() {

  let [actionList, setActionList] = useState([])
  let [displayActionList, setDisaplyActionList] = useState([])
  let [filterText, setFilterText] = useState('all')

  let [username, setState] = useState('')
  useEffect(() => {
    const actionListRaw = JSON.parse(localStorage.getItem('actionList'))
    if(actionListRaw){
      setActionList(actionListRaw)
    }
    return () => {
      console.log('cleanup-count');
    }
  }, [])
  useEffect(() => {
    if (filterText === 'all') {
      setDisaplyActionList(actionList)
    }
    if(filterText === 'active'){
      setDisaplyActionList(actionList.filter(action => action.done === 0))
    }
    if(filterText === 'done'){
      setDisaplyActionList(actionList.filter(action => action.done === 1))
    }
    
  },[filterText,actionList])

  const onclick = () => {
    console.log(actionList);
    //输入框的值
    setActionList((actionList) => [{title: username, done: 0},...actionList, ],)
    setState('')
  }

  function inputChange(e) {
    setState(e.target.value)
  }

  const onSave = () => {
    localStorage.setItem('actionList', JSON.stringify(actionList))
  }
  const onRemove = (index) => { 

    setActionList((actionList) => {
      //根据index删除元素
      let actionListNew = []
      actionListNew=actionList.filter((action, idx) => idx !== index)
      return actionListNew
    })

  }
  const onFinish = (index) => {
    setActionList((actionList) => {
      //根据index删除元素
      const actionList1=actionList.map((action, idx) => {
        if (idx === index) {
          return {...action,done : 1}
        }else{
          return action
        }
      })
      return  actionList1

      // actionList.forEach((element, idx) => {
      //   if (idx === index) {
      //     element.done = 1
      //   }
      // });
      // console.log('actionList',actionList);
      // return actionList
      // return JSON.parse(JSON.stringify(actionList))
    })
  }
  const onCancel = (index) => {
    setActionList((actionList) => {
        return  actionList.map((action, idx) => {
        if (idx === index) {
          return {...action,done : 0}
        }else{
          return action
        }
      })
    })
  }


  return (<div>
    <div>
      <input type="radio" name="fiter" id="all" checked={filterText==='all'} onChange={(e) => setFilterText('all')} />
      <label htmlFor="all">all</label>
      <input type="radio" name="fiter" id="active" checked={filterText==='active'} onChange={(e) => setFilterText('active')} />
      <label htmlFor="active">active</label>
      <input type="radio" name="fiter" id="done" checked={filterText==='done'} onChange={(e) => setFilterText('done')} />
      <label htmlFor="done">done</label>
    </div>
    <input onInput={(e) => inputChange(e)} type="text" />
    <button onClick={onclick}>add</button>
    <button onClick={onSave}>save</button>
    <ul>
      {displayActionList.map((action, index) =>
      <TodoItem action={action} index={index} onRemove={onRemove} onFinish={onFinish} onCancel={onCancel}></TodoItem>
      )}
    </ul>
  </div>)

}
const TodoItem=({action,index,onRemove,onFinish,onCancel})=>{
  return (<li><span className={ action.done?'done':''}> {action.title}</span>
  <button onClick={() => onRemove(index)}>remove</button>
  <button onClick={() => onFinish(index)}>finish</button>
  <button onClick={() => onCancel(index)}>cancel</button>
</li>)
}

function App() {
  return (<div id="app">
    <Todolist></Todolist>

  </div>)
}
export default App