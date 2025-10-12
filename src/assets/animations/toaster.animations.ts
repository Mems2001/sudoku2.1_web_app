import { MotionProps } from "framer-motion";

export const ToasterAnimationProps:MotionProps = {
    initial: {x: '-50%', y: '-100%', opacity: 0},
    animate: {y: 0, opacity: 1},
    exit: {y: '-100%', opacity: 0},
    transition: {duration: 0.25, ease: 'easeInOut'}
}