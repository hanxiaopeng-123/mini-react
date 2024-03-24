function render(el, container) {
    fiberOfUnit = {
        dom: container,
        props: {
            children: [el]
        }
    }
    // const dom = el.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(el.type)
    // console.log('dom', dom);
    // const props = el.props
    // const children = el.props.children
    // for (let key in props) {
    //     if (key !== 'children') {
    //         dom[key] = props[key]
    //     }
    // }
    // children.forEach(child => render(child, dom))
    // container.append(dom)
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
const initChildren=(fiber)=>{
    let prevChild = null
    fiber.props.children.forEach((child, index) => {
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

let fiberOfUnit = null
//执行任务函数
const performUnitOffiber = (fiber) => {
    if (!fiber.dom) {
        //1 创建dom
        const dom = createDom(fiber)
        //将子节点添加到父级容器
        fiber.parent.dom.append(dom)
        const props = fiber.props
        //2 遍历props
        updateProps(dom, props)
    }

    //3 生成链表
    initChildren(fiber)

    //4 返回下一个任务
    if (fiber.child) {
        return fiber.child
    }
    if (fiber.sibling) {
        return fiber.sibling
    }
    let parent=fiber.parent
    //找父亲的兄弟 父亲的兄弟没有的话 找爷爷的兄弟
    while (parent) {
        if (parent.sibling) {
            return parent.sibling
        }
        parent=parent.parent
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
    requestIdleCallback(fiberLoop)

}

requestIdleCallback(fiberLoop)
export { ReactDOM }









