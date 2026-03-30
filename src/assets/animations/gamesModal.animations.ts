import { Variants } from "framer-motion";

export const GameTypesVariants: Variants = {
    hidden: {
        opacity: 0,
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1,
            when: "afterChildren"
        }
    },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
}

export const GameTypeVariants: Variants = {
    hidden: {opacity: 0},
    show: {opacity: 1}
}