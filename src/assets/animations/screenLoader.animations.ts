import { MotionProps } from "framer-motion"

export const loaderLogoProps:MotionProps = {
    initial: {opacity: 0, position: 'absolute', top: '75%', transform: 'scale(3)'},
    animate: {opacity: 1, position: 'relative', top: 'auto', left: 'auto', transform: 'scale(1)'},
    exit: {opacity: 0},
    transition: {duration: 1, ease: "easeInOut"}
}

export const loaderGridProps:MotionProps = {
    initial: {opacity: 0},
    animate: {opacity: 1},
    exit: {opacity: 0},
    transition: {duration: 0.5, delay: 1, ease: "easeInOut"}
}