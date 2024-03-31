const createTextNode = (text) => {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: []
        }
    }
}
function convertElement(child){
return typeof child === 'object' ?child  : createTextNode(child)
} 
const createElement = (type, props, ...children) => {
    return {
        type,
        props: {
            ...props,
            children: children.reduce((prev,child) => {
               if(!child){
                   return [...prev]
               }
               if(Array.isArray(child)){
                return [...prev,...child.map(convertElement)]
               }
               return [...prev,convertElement(child)]
            },[])
        }
    }
}
// const createElement = (type, props, ...children) => {
//     return {
//         type,
//         props: {
//             ...props,
//             children: children.map(child => {
//                 console.log('typeof child---->',typeof child);
//                 console.log('child---->', child);
//                 if (typeof child === 'string' || typeof child === 'number') {
//                     return createTextNode(child)
//                 } else if (Array.isArray(child)) {
//                     console.log('child---->', child);
//                     return createElement('div', {}, ...child)
//                 } else {
//                     console.log('else---->', child);
//                     return child
//                 }
//             })
//         }
//     }
// }
export default { createElement, createTextNode }