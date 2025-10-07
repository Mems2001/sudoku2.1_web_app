import { useNavigate } from "react-router-dom"

function AdminConsole() {
    const navigate = useNavigate()

    return (
        <section className="admin-console-container">
            <div className="buttons-container">
                <button className="menu-button" onClick={() => navigate('/admin/lab')}>Lab</button>
                <button className="menu-button">Create 1000 sudokus</button>
            </div>
            <button className="menu-button" onClick={() => navigate('/')}>Back</button>
        </section>
    )
}

export default AdminConsole