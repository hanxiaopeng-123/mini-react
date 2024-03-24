function render (el,container) {
    const dom=el.type==='TEXT_ELEMENT'?document.createTextNode(''):document.createElement(el.type)
    console.log('dom',dom);
    const props=el.props
    const children=el.props.children
    for(let key in props){
        if(key!=='children'){
            dom[key]=props[key]
        }
    }
    children.forEach(child=>render(child,dom))
    container.append(dom)
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
export  {ReactDOM}







  
    
