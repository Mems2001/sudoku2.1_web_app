import { motion } from "framer-motion"
import React from "react"

interface ButtonSpinnerProps {
    size: number,
    color: string
}

const ButtonSpinner:React.FC<ButtonSpinnerProps> = ({size=20, color='#ffffff'}) => {
    return (
        <motion.div
             style={{
               width: size,
               height: size,
               border: `3px solid ${color}33`,
               borderTop: `3px solid ${color}`, 
               borderRadius: "50%",
               placeSelf: 'center'
             }}
             animate={{ rotate: 360 }}
             transition={{
               repeat: Infinity,
               duration: 1,
               ease: "linear",
             }}
        />
    )
}

export default ButtonSpinner