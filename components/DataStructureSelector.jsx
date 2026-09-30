 "use client";
const items=["Linked List","Stack","Queue","BST","Graph","Heap"];
export default function DataStructureSelector({value,onChange}){return <section className="panel"><h3>01　Data structure</h3><div className="choices">{items.map(x=><button key={x} className={value===x?"selected":""} onClick={()=>onChange(x)}>{x}</button>)}</div></section>}