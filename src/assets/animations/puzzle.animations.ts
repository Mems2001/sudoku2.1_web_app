import { MotionProps, Variants } from "framer-motion"

export const PuzzleProps: MotionProps = {
    initial: "hidden", 
    animate: "show",
    exit: "hidden",
    variants: {
        hidden: { 
            opacity: 0,
            transition: { duration: 0.81, ease: 'easeOut' } 
        },
        show: { 
            opacity: 1,
            transition: { duration: 0.25 , ease: 'easeIn'} 
        }
    }
}

export const PuzzleGridVariants:Variants = {
    hidden: { 
        opacity: 0,
        transition: {
            staggerChildren: 0.005,
            when: "afterChildren",
            staggerDirection: -1
        }
        },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.01  
        }
    }
}

 export const PuzzleCellVariants:Variants = {
    hidden: { opacity: 0, scale: 0.5, y: 10 },
    show: { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 24 }
    }
}