import {motion} from 'framer-motion'
import { NumbersWheelProps } from '../../assets/animations'
import React, { useEffect, useRef, useState } from 'react'
import { CellAnnotation } from '../../models/types'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

interface WheelProps {
    currentFocused: string | undefined,
    timeElapsed: number,
    numberButton(value: number|CellAnnotation, timeElapsed: number): any,
    setAnnotation: any,
    setShowWheel: React.Dispatch<React.SetStateAction<boolean>>,
    notebookMode: boolean
}

const NumbersWheel:React.FC<WheelProps> = ({ currentFocused, timeElapsed, numberButton, setAnnotation, setShowWheel, notebookMode}) => {
    const {highlight_color} = useSelector((state:RootState) => state.gameSettings.value)
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
            if (!notebookMode) await numberButton(hoveredNumber, timeElapsed)
            else await setAnnotation(hoveredNumber)
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
        <motion.div ref={wheelRef} className={`numbers-wheel ${hoveredNumber === null ? 'unfocused' : ''}`} style={{top: `${(parseInt(currentFocused![0]) * (0.6) * 100)/8}%`, left: `${(parseInt(currentFocused![1]) * (0.6) * 100)/8}%`}} {...NumbersWheelProps}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                <div key={number} style={hoveredNumber === number ? {backgroundColor: `var(--shcolor-${highlight_color})`,boxShadow: `0 0 3px 1px var(--shcolor-${highlight_color})`, transition: "all 150ms ease-in-out"}: {}} className={`wheel-number ${hoveredNumber !== number ? 'unhovered' : ''} ${hoveredNumber === null ? 'unfocused' : ''}`}>{number}</div>
            ))}
        </motion.div>
    )
}

export default NumbersWheel