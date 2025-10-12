import { MotionProps } from "framer-motion";

export const GameModalProps:MotionProps = {
    initial: {opacity: 0},
    animate: {opacity: 1},
    exit: {opacity: 0},
    transition: {duration: 0.15, ease: "easeInOut"}
}

export const GameModalWindowProps:MotionProps = {
    initial: {opacity: 0, y: 0, x: '-50%'},
    animate: {opacity: 1, y: '-50%'},
    exit: {opacity: 0, y: 0},
    transition: {duration: 0.15, ease: "easeInOut"}
}