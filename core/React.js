export const createTextNode=(text)=>{
return {
    type:'TEXT_ELEMENT',
    props:{
        nodeValue:text,
        children: []
    }
}
}
export const createElement=(type,props,...children)=>{
    return {
        type,
        props:{
            ...props,
            children:children.map(child=>
                typeof child==='string'
                ?createTextNode(child):child)
            }}
}
