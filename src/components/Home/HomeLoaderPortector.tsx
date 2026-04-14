import React, { useEffect, useState } from "react"
import HomeLoader from "./HomeLoader"
import { Outlet } from "react-router-dom"
import { motion} from "framer-motion"
import { loaderExitProps } from "../../assets/animations"

interface HomeLoaderProtectorProps {
    role: string | null,
    authenticateSession(): void
}

const HomeLoaderProtector:React.FC<HomeLoaderProtectorProps> = ({role, authenticateSession}) => {

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
                    <HomeLoader role={role} authenticateSession={authenticateSession}/>
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