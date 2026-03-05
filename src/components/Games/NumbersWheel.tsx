import {motion} from 'framer-motion'
import { NumbersWheelProps } from '../../assets/animations'
import React, { useEffect, useRef, useState } from 'react'
import { CellAnnotation } from '../../models/types'
import { time } from 'console'

interface WheelProps {
    currentFocused: string | undefined,
    timeElapsed: number,
    numberButton(value: number|CellAnnotation, timeElapsed: number): any,
    setShowWheel: React.Dispatch<React.SetStateAction<boolean>>
}

const NumbersWheel:React.FC<WheelProps> = ({ currentFocused, timeElapsed, numberButton, setShowWheel}) => {
    const [hoveredNumber, setHoveredNumber] = useState<number | null>(null)
    const wheelRef = useRef<HTMLDivElement>(null)

    const handlePointerMove = (e: PointerEvent) => {
        if (!wheelRef.current) return

        let rect = undefined
        if (wheelRef.current) rect = wheelRef.current.getBoundingClientRect()
        if (!rect) return
        // console.log(rect)
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        // Check if finger is inside the wheel boundaries
        if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
            setHoveredNumber(null)
            return
        }

        // Calculate grid position (0, 1, or 2)
        const col = Math.floor((x / rect.width) * 3)
        const row = Math.floor((y / rect.height) * 3)
    
        // Map 3x3 grid to 1-9
        const number = row * 3 + col + 1
        // console.warn(number)
        setHoveredNumber(number)
    }

    async function handlePointerUp() {
        if (hoveredNumber) {
            setShowWheel(false)
            await numberButton(hoveredNumber, timeElapsed)
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
        }
    }, [hoveredNumber])

    return (
        <motion.div ref={wheelRef} className="numbers-wheel" style={{top: `${(parseInt(currentFocused![0]) * (0.6) * 100)/8}%`, left: `${(parseInt(currentFocused![1]) * (0.6) * 100)/8}%`}} {...NumbersWheelProps}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                <div key={number} className="wheel-number">{number}</div>
            ))}
        </motion.div>
    )
}

export default NumbersWheel