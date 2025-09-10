import { NavLink } from "react-router-dom";
import LoginFormC from "./LoginForm"

function Login() {
    
  return (
    <div className="login-container">
      <h1>Log In</h1>
    
      <LoginFormC />

      <NavLink to={'/'}>Back to Home</NavLink>
    </div>
  );
}

export default Login;