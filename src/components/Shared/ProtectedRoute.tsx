import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../hooks"

function ProtectedRoute () {
    const { isLogged, role } = useAuth()
    
    if (isLogged && role === 'admin') return (
        <Outlet />
    ) 
    else return (
       <Navigate to={'/'}/> 
    )
}

export default ProtectedRoute