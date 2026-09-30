 "use client";
import {motion,AnimatePresence} from "framer-motion";
export function Animator({id,children,className=""}){return <AnimatePresence mode="popLayout"><motion.div key={id} layout initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:.25}} className={className}>{children}</motion.div></AnimatePresence>}