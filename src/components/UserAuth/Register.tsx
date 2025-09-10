import { useState } from "react";
import { useForm } from "react-hook-form";
import { LoginForm } from "../../models/types";
import { useAuth } from "../../hooks/useAuth";
import { NavLink } from "react-router-dom";

function Register() {
    const {handleSubmit , register , formState:{errors} , getValues, watch} = useForm<LoginForm>()
    const { handleRegistration } = useAuth()
    const password = watch("password")

    const [disableButton, setDisableButton] = useState(true)

    function registerSubmit (data:LoginForm) {
        handleRegistration(data)
    }

    function validateButton() {
        const username = getValues('username')
        const email = getValues('email')
        const password = getValues('password')
        const confirm_password = getValues('confirm_password')

        if (username && email && password && confirm_password) {
            return setDisableButton(false)
        } else {        
            return setDisableButton(true)
        }
    }

    return (
        <div className="login-container">
            <h1>Register</h1>
            
            <form onSubmit={handleSubmit(registerSubmit)} className="login-form">
              <div className="input-container"> 
                <div className="custom-input">
                    <input className="input-text" type="text" id="username" placeholder="Username" autoComplete="username"
                    {...register('username' , {required:true , onChange: validateButton})}
                    aria-invalid={errors.username ? 'true' : 'false'}/>
                    <div className="input-icon">
                        <i className="fa-solid fa-user fa-xl"></i>
                    </div>
                </div>
              </div>

              <div className="input-container">
                <div className="custom-input">
                    <input className="input-text" type="text" id="email" placeholder="E-mail" autoComplete="email" 
                    {...register('email' , {required:true , onChange:validateButton , pattern:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/})}
                    aria-invalid={errors.email ? 'true' : 'false'}/>
                    <div className="input-icon">
                        <i className="fa-solid fa-envelope fa-xl"></i>
                    </div>
                </div>
                  {errors.email?.type === "pattern" && (
                  <p className="form-error" role="alert">*Email format is not correct</p>
                  )}
              </div>    

              <div className="input-container">
                  <div className="custom-input">
                    <input className="input-text" type="password" id="password" placeholder="Password" autoComplete="password" 
                    {...register('password' , {required:true , onChange:validateButton , minLength: 8 , maxLength: 20})}
                    aria-invalid={errors.password ? 'true' : 'false'}/>
                    <div className="input-icon">
                        <i className="fa-solid fa-key fa-xl"></i>
                    </div>
                  </div>
                  {errors.password?.type === "minLength" && (
                  <p className="form-error" role="alert">*Password's min length is 8 characters</p>
                  )}
                  {errors.password?.type === "maxLength" && (
                  <p className="form-error" role="alert">*Password's max length is 20 characters</p>
                  )}
              </div>

              <div className="input-container">
                  <div className="custom-input">
                    <input className="input-text" type="password" id="confirm_password" placeholder="Confirm password" autoComplete="password" 
                    {...register('confirm_password' , {required:true , onChange:validateButton , minLength: 8 , maxLength: 20, validate: (value) => value === password})}
                    aria-invalid={errors.password ? 'true' : 'false'}/>
                    <div className="input-icon">
                        <i className="fa-solid fa-key fa-xl"></i>
                    </div>
                  </div>
                  {errors.confirm_password?.type === "minLength" && (
                    <p className="form-error" role="alert">*Password's min length is 8 characters</p>
                  )}
                  {errors.confirm_password?.type === "maxLength" && (
                    <p className="form-error" role="alert">*Password's max length is 20 characters</p>
                  )}
                  {errors.confirm_password?.type === "validate" && (
                    <p className="form-error" role="alert">*Both password fields must match</p>
                  )}
              </div>

              <button disabled={disableButton} className={disableButton? 'disabled' : ''} type="submit">Submit</button>

                <p className="advertisement">Already have an account? <a href="#/login">Log In</a></p>

            </form>

            <NavLink to={'/'}>Back to Home</NavLink>
        </div>
    );
}

export default Register;