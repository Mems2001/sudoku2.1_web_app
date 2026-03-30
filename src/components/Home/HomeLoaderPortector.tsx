import React, { useEffect, useState } from "react"
import HomeLoader from "./HomeLoader"
import { Outlet } from "react-router-dom"
import { motion} from "framer-motion"
import { PageEntranceProps, loaderExitProps } from "../../assets/animations"

interface HomeLoaderProtectorProps {
    role: string | null
}

const HomeLoaderProtector:React.FC<HomeLoaderProtectorProps> = ({role}) => {

    const [timerOut, setTimerOut] = useState(false)

    useEffect(
        () => {
            const timer = setTimeout(() => {
                setTimerOut(true)
            }, 500)

            return () => clearTimeout(timer)
        }, [timerOut]
    )

    return (
        <>
            {!role || !timerOut ? (
                <motion.div
                key='screen-loader'
                {...loaderExitProps}>
                    <HomeLoader/>
                </motion.div>
            ) : (
                <motion.div
                key='main-content-wrapper'
                >
                    <Outlet />
                </motion.div>
            )}
        </>
    )
}

export default HomeLoaderProtector