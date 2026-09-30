 "use client";
import {motion} from "framer-motion";
function insert(root,v){if(!root)return {v,l:null,r:null};if(v<root.v)root.l=insert(root.l,v);else root.r=insert(root.r,v);return root}
function Node({n}){if(!n)return null;return <div className="treewrap"><motion.div initial={{scale:0}} animate={{scale:1}} className="treenode">{n.v}</motion.div>{(n.l||n.r)&&<div className="children"><div>{n.l&&<Node n={n.l}/>}</div><div>{n.r&&<Node n={n.r}/>}</div></div>}</div>}
export default function BSTVisualizer({data=[]}){let root=null;data.forEach(v=>root=insert(root,v));return <div className="stage tree">{root?<Node n={root}/>:<p>Tree is empty</p>}</div>}