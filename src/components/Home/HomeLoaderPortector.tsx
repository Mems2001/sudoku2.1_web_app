import React from "react"
import HomeLoader from "./HomeLoader"
import { Outlet } from "react-router-dom"

interface HomeLoaderProtectorProps {
    role: string | null
}

const HomeLoaderProtector:React.FC<HomeLoaderProtectorProps> = ({role}) => {
    if (!role) return (
        <HomeLoader />
    )
    else return (
        <Outlet />
    )
}

export default HomeLoaderProtector