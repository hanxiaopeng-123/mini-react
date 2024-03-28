 const createTextNode=(text)=>{
return {
    type:'TEXT_ELEMENT',
    props:{
        nodeValue:text,
        children: []
    }
}
}
 const createElement=(type,props,...children)=>{
    return {
        type,
        props:{
            ...props,
            children:children.map(child=>
            {
               return (typeof child==='string'||typeof child==='number')
                ?createTextNode(child):child
            })
            }}
}
export default {createElement,createTextNode}