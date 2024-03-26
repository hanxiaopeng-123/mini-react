function render(el, container) {
    fiberOfUnit = {
        dom: container,
        props: {
            children: [el]
        }
    }
    root = fiberOfUnit
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

const updateProps = (dom, props) => {
    for (let key in props) {
        if (key !== 'children') {
            dom[key] = props[key]
        }
    }
}
const initChildren = (fiber, children) => {
    console.log('fiber', fiber);
    console.log('children', children);
    let prevChild = null
    children.forEach((child, index) => {
        let newfiber = {
            type: child.type,
            props: child.props,
            dom: null,
            parent: fiber,
            sibling: null,
            child: null
        }
        if (index == 0) {
            fiber.child = newfiber
        } else {
            prevChild.sibling = newfiber
        }
        prevChild = newfiber

    });
}

const updateFunctionComponent = (fiber) => {
    const children =  [fiber.type(fiber.props)] 
    //3 生成链表
    initChildren(fiber, children)
}
const updateNormalComponent = (fiber) => {
    if (!fiber.dom) {
        //1 创建dom
        const dom = createDom(fiber)
        //将子节点添加到父级容器
        // fiber.parent.dom.append(dom)
        const props = fiber.props
        //2 遍历props
        updateProps(dom, props)
    }
    const children =  fiber.props.children
    //3 生成链表
    initChildren(fiber, children)
}

let root = null
let fiberOfUnit = null
//执行任务函数
const performUnitOffiber = (fiber) => {
    console.log(fiber);
    console.log(typeof fiber.type);
    const isFunctionComponent = typeof fiber.type === 'function'
    if (isFunctionComponent) {
        updateFunctionComponent(fiber)
    }else{
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
        shouldYield = deadline.timeRemaining() < 1
    }
    //统一提交根节点 没有下一个节点 并且只提交一次
    if (!fiberOfUnit && root) {
        commitRoot()
    }
    requestIdleCallback(fiberLoop)

}
const commitRoot = () => {
    commitWork(root.child)
    root = null
}
const commitWork = (fiber) => {
    console.log('fiber-->', fiber);
    if (!fiber) return
    //函数组件 没有dom属性 找父级 直到找到有dom的父级插入进去
    let fiberParent = fiber.parent
    while (!fiberParent.dom) {
        fiberParent = fiberParent.parent
    }
    //判断是否有dom 没有的话 就不插入
    if (fiber.dom) {
        fiberParent.dom.append(fiber.dom)
    }
    if (fiber.child) {
        commitWork(fiber.child)
    }
    if (fiber.sibling) {
        commitWork(fiber.sibling)
    }
}


requestIdleCallback(fiberLoop)
export { ReactDOM }









