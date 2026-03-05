import {motion} from 'framer-motion'
import { NumbersWheelProps } from '../../assets/animations'
import React from 'react'

interface WheelProps {
    currentFocused: string | undefined
}

const NumbersWheel:React.FC<WheelProps> = ({ currentFocused}) => {
    return (
        <motion.div className="numbers-wheel" style={{top: `${(parseInt(currentFocused![0]) * (2/3) * 100)/8}%`, left: `${(parseInt(currentFocused![1]) * (2/3) * 100)/8}%`}} {...NumbersWheelProps}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                <div key={number} className="number">{number} {currentFocused}</div>
            ))}
        </motion.div>
    )
}

export default NumbersWheel