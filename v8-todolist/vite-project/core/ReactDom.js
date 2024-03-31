function render(el, container) {
    fiberOfUnit = {
        dom: container,
        props: {
            children: [el]
        }
    }
    wipRoot = fiberOfUnit
}
function update() {
    let currentFiber = wipFiber
    return () => {

        wipRoot = {
            ...currentFiber,
            alternate: currentFiber
        }
        fiberOfUnit = wipRoot
    }

}
const ReactDOM = {
    createRoot(container) {
        return {
            render(App) {
                render(App, container)
            }
        }
    }
}
const createDom = (fiber) => {
    const dom = (fiber.dom = fiber.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type))
    return dom
}

const updateProps = (dom, props, oldProps) => {
    //老的有 新的没有 删除 
    for (let key in oldProps) {
        if (!(key in props)) {
            dom.removeAttribute(key)
        }
    }
    //老的有 新的有 更新
    //老的没有 新的有 新增
    for (let key in props) {
        if (key !== 'children') {
            if (props[key] !== oldProps[key]) {
                if (key.startsWith('on')) {
                    const eventType = key.slice(2).toLowerCase()
                    //删除旧的绑定事件
                    dom.removeEventListener(eventType, oldProps[key])
                    dom.addEventListener(eventType, props[key])
                } else {
                    dom[key] = props[key]
                }
            }

        }
    }
}

let deletions = []
const reconcileChildren = (fiber, children) => {

    let oldFiber = fiber.alternate?.child
    let prevChild = null
    children.forEach((child, index) => {
        const isSameType = oldFiber && oldFiber.type == child.type
        let newfiber
        if (isSameType) {
            //更新

            newfiber = {
                type: child.type,
                props: child.props,
                dom: oldFiber.dom,
                parent: fiber,
                sibling: null,
                child: null,
                effectTag: 'update',
                alternate: oldFiber
            }
        } else {
            //新增
            if (child) {
                newfiber = {
                    type: child.type,
                    props: child.props,
                    dom: null,
                    parent: fiber,
                    sibling: null,
                    child: null,
                    effectTag: 'placement'
                }
            }

            if (oldFiber) {
                deletions.push(oldFiber)
            }
        }
        if (oldFiber) {
            oldFiber = oldFiber.sibling
        }

        if (index == 0) {
            fiber.child = newfiber
        } else {
            prevChild.sibling = newfiber
        }
        if (newfiber) {
            prevChild = newfiber
        }

    });
    while (oldFiber) {
        deletions.push(oldFiber)
        oldFiber = oldFiber.sibling
    }
}

const updateFunctionComponent = (fiber) => {
    hookArr = []
    hookIndex = 0
    effectHooks=[]
    wipFiber = fiber
    const children = [fiber.type(fiber.props)]
    //3 生成链表
    reconcileChildren(fiber, children)
}
const updateNormalComponent = (fiber) => {
    if (!fiber.dom) {
        //1 创建dom
        const dom = createDom(fiber)
        //将子节点添加到父级容器
        // fiber.parent.dom.append(dom)
        const props = fiber.props
        //2 遍历props
        updateProps(dom, props, {})
    }
    const children = fiber.props.children
    //3 生成链表
    reconcileChildren(fiber, children)
}
let wipFiber = null
let wipRoot = null
let currentRoot = null
let fiberOfUnit = null
//执行任务函数
const performUnitOffiber = (fiber) => {
    // console.log(fiber);
    // console.log(typeof fiber.type);
    const isFunctionComponent = typeof fiber.type === 'function'
    if (isFunctionComponent) {
        updateFunctionComponent(fiber)
    } else {
        updateNormalComponent(fiber)
    }

    //4 返回下一个任务
    if (fiber.child) {
        return fiber.child
    }
    if (fiber.sibling) {
        return fiber.sibling
    }
    let parent = fiber.parent
    //找父亲的兄弟 父亲的兄弟没有的话 找爷爷的兄弟
    while (parent) {
        if (parent.sibling) {
            return parent.sibling
        }
        parent = parent.parent
    }
}
const fiberLoop = (deadline) => {
    let shouldYield = false
    if (!shouldYield && fiberOfUnit) {
        //执行任务
        //执行完返回新的任务
        fiberOfUnit = performUnitOffiber(fiberOfUnit)
        //当前root的兄弟节点和下一个节点类型相同时 结束更新
        if (wipRoot?.sibling?.type == fiberOfUnit?.type) {
            fiberOfUnit = undefined
        }
        shouldYield = deadline.timeRemaining() < 1
    }
    //统一提交根节点 没有下一个节点 并且只提交一次
    if (!fiberOfUnit && wipRoot) {
        commitRoot()
      
    }
    //更新调用 root
    if(fiberOfUnit&&!wipRoot){
        wipRoot=currentRoot
    }

    requestIdleCallback(fiberLoop)

}
const commitRoot = () => {
    deletions.forEach(commitDeletion);
    commitWork(wipRoot.child)
    commitCleanup()
    commitEffect()
    currentRoot = wipRoot
    wipRoot = null
    deletions = []
}
const commitCleanup = () => {
    function runCleanup(fiber) {
        if(!fiber)return
        // fiber.alternate?.effectHooks?.forEach((hook)=>{
        //     console.log('commitCleanup',hook);
        //     hook?.cleanup()
        // })
        if(fiber.alternate){
            const oldEffecHooks=fiber?.alternate?.effectHooks
            fiber?.effectHooks?.forEach((newHook,index)=>{
                if(newHook.deps.length===0)return
                newHook.deps.forEach((newDep,idx)=>{
                    if(newDep!==oldEffecHooks[index].deps[idx]){
                        oldEffecHooks[index]?.cleanup?.()
                    }
                })
            })
        }
        runCleanup(fiber.child)
        runCleanup(fiber.sibling)
    }
    runCleanup(wipRoot)
}
const commitEffect=()=>{
    function run(fiber){
        // console.log('commitEffect-fiber',fiber);
        if(!fiber)return
        if(!fiber.alternate){
            //新增
            fiber.effectHooks?.forEach((hook)=>{
               hook.cleanup=  hook.callback()
            })
        }else{
            //编辑
            //判断依赖值有没有改变 改变才调用
            const oldEffecHooks=fiber?.alternate?.effectHooks
            fiber?.effectHooks?.forEach((newHook,index)=>{
                if(newHook.deps.length===0)return
                newHook.deps.forEach((newDep,idx)=>{
                    if(newDep!==oldEffecHooks[index].deps[idx]){
                        newHook.cleanup=  newHook.callback()
                    }else{
                        newHook.cleanup=  oldEffecHooks[index].cleanup
                    }
                })
            })
        }
        run(fiber.child)
        run(fiber.sibling)
    }
    run(wipRoot)
}
const commitDeletion = (fiber) => {

    if (fiber.dom) {
        let fiberParent = fiber.parent
        while (!fiberParent.dom) {
            fiberParent = fiberParent.parent
        }
        fiberParent.dom.removeChild(fiber.dom)
    } else {
        commitDeletion(fiber.child)
    }
}
const commitWork = (fiber) => {
    if (!fiber) return
    //函数组件 没有dom属性 找父级 直到找到有dom的父级插入进去
    let fiberParent = fiber.parent
    while (!fiberParent.dom) {
        fiberParent = fiberParent.parent
    }
    if (fiber.effectTag === 'update'&&fiber.dom) {
        updateProps(fiber.dom, fiber.props, fiber.alternate.props)
    } else if (fiber.effectTag === 'placement') {
        //判断是否有dom 没有的话 就不插入
        if (fiber.dom) {
            fiberParent.dom.append(fiber.dom)
        }
    }

    if (fiber.child) {
        commitWork(fiber.child)
    }
    if (fiber.sibling) {
        commitWork(fiber.sibling)
    }
}
let hookArr
let hookIndex
const useState = (initial) => {
    let currentFiber = wipFiber
    const oldstateHook = currentFiber.alternate?.hookArr[hookIndex]
    const stateHook = {
        state: oldstateHook ? oldstateHook.state : initial,
        queue: oldstateHook ? oldstateHook.queue : []
    }
    stateHook.queue.forEach(action => {
        stateHook.state = action(stateHook.state)
    })
    stateHook.queue.length = 0
    hookIndex++
    hookArr.push(stateHook)
    currentFiber.hookArr = hookArr
    const setState = (action) => {
        //检测修改后的值是否和之前一样 一样的话就不需要渲染
        const eagerState=typeof action === 'function'?action(stateHook.state):action
        if(eagerState===stateHook.state)return
        stateHook.queue.push(typeof action === 'function' ? action : () => action)
        wipRoot = {
            ...currentFiber,
            alternate: currentFiber
        }
        fiberOfUnit = wipRoot

    }
    return [stateHook.state, setState]
}

let effectHooks=[]
const useEffect = (callback, dependencies) => {
    let currentFiber = wipFiber
    const effectHook={
        callback,
        deps:dependencies,
        cleanup:null
    }
    effectHooks.push(effectHook)
    currentFiber.effectHooks=effectHooks
}

requestIdleCallback(fiberLoop)
export { ReactDOM, update, useState,useEffect }









