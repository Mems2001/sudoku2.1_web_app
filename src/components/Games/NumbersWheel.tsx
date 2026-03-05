import {motion} from 'framer-motion'
import { NumbersWheelProps } from '../../assets/animations'
import React, { useEffect, useRef, useState } from 'react'

interface WheelProps {
    currentFocused: string | undefined
}

const NumbersWheel:React.FC<WheelProps> = ({ currentFocused}) => {
    const [hoveredNumber, setHoveredNumber] = useState<number | null>(null)
    const wheelRef = useRef<HTMLDivElement>(null)

    const handlePointerMove = (e: PointerEvent) => {
        if (!wheelRef.current) return

        const rect = wheelRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        // Check if finger is inside the wheel boundaries
        if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
            setHoveredNumber(null); // Finger dragged outside
            return;
        }

        // Calculate grid position (0, 1, or 2)
        const col = Math.floor((x / rect.width) * 3)
        const row = Math.floor((y / rect.height) * 3)
    
        // Map 3x3 grid to 1-9
        const number = row * 3 + col + 1
        console.warn(number)
        setHoveredNumber(number)
    }

    function handlePointerUp() {
        if (hoveredNumber) {
            console.error(hoveredNumber)
        }
    }

    useEffect(() => {
        // We attach listeners to window so movement is tracked 
        // even if the finger leaves the wheel's visual box
        window.addEventListener('pointermove', handlePointerMove)
        window.addEventListener('pointerup', handlePointerUp)
        return () => {
            window.removeEventListener('pointermove', handlePointerMove)
            window.removeEventListener('pointerup', handlePointerUp)
        };
    }, [hoveredNumber])

    return (
        <motion.div ref={wheelRef} className="numbers-wheel" style={{top: `${(parseInt(currentFocused![0]) * (2/3) * 100)/8}%`, left: `${(parseInt(currentFocused![1]) * (2/3) * 100)/8}%`}} {...NumbersWheelProps}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                <div onTouchStart={() => console.warn(number)} key={number} className="number">{number} {hoveredNumber}</div>
            ))}
        </motion.div>
    )
}

export default NumbersWheel