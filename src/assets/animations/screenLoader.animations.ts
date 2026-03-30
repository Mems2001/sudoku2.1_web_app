import { MotionProps, Variants } from "framer-motion"

export const loaderExitProps:MotionProps = {
    initial: {opacity: 1},
    exit: {opacity: 0},
    transition: {duration: 0.5, ease: "easeOut"}
}

export const homeEntranceProps: MotionProps = {
    initial: {opacity: 0},
    animate: {opacity: 1},
    transition: {duration: 0.5, ease: "easeIn"}
}

export const loaderLogoProps:MotionProps = {
    initial: {opacity: 0, position: 'absolute', top: '75%', transform: 'scale(3)'},
    animate: {opacity: 1, position: 'relative', top: 'auto', left: 'auto', transform: 'scale(1)'},
    exit: {opacity: 0},
    transition: {duration: 1, ease: "easeInOut"}
}

export const loaderTextProps:MotionProps = {
    initial: {opacity: 0},
    animate: {opacity: 1},
    exit: {opacity: 0},
    transition: {duration: 0.5, delay: 1, ease: "easeInOut"}
}

export const gridVariants:Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.01, 
            delayChildren: 1,    
        }
    }
}

 export const cellVariants:Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    show: { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 24 }
    }
}