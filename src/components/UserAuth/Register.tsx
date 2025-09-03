import { useState } from "react";
import { useForm } from "react-hook-form";
import { LoginForm } from "../../models/types";
import { useAuth } from "../../hooks/useAuth";

function Register() {
    const {handleSubmit , register , formState:{errors} , getValues} = useForm<LoginForm>()
    const { handleRegistration } = useAuth()

    const [disableButton, setDisableButton] = useState(true)

    function registerSubmit (data:LoginForm) {
        handleRegistration(data)
    }

    function validateButton() {
        const username = getValues('username')
        const email = getValues('email')
        const password = getValues('password')

        if (username && email && password) {
            return setDisableButton(false)
        } else {        
            return setDisableButton(true)
        }
    }

    return (
        <div className="login-container">
      <h1>Register</h1>
      <div></div>
      <form onSubmit={handleSubmit(registerSubmit)} className="login-form">
        <div className="input-container">
            <label htmlFor="username">Username</label> 
            <input type="text" id="username" placeholder="Type your username" autoComplete="username"
            {...register('username' , {required:true , onChange: validateButton})}
            aria-invalid={errors.username ? 'true' : 'false'}/>
        </div>
        <div className="input-container">
            <label htmlFor="email">e-mail</label>
            <input type="text" id="email" placeholder="Type your e-mail" autoComplete="email" 
            {...register('email' , {required:true , onChange:validateButton , pattern:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/})}
            aria-invalid={errors.email ? 'true' : 'false'}/>
            {errors.email?.type === "pattern" && (
            <p className="form-error" role="alert">*Email format is not correct</p>
            )}
        </div>            
        <div className="input-container">
            <label htmlFor="password">
                Password:
            </label>
            <input type="password" id="password" placeholder="Type a password" autoComplete="password" 
            {...register('password' , {required:true , onChange:validateButton , minLength: 8 , maxLength: 20})}
            aria-invalid={errors.password ? 'true' : 'false'}/>
            {errors.password?.type === "minLength" && (
            <p className="form-error" role="alert">*Password's min length is 8 characters</p>
            )}
            {errors.password?.type === "maxLength" && (
            <p className="form-error" role="alert">*Password's max length is 20 characters</p>
            )}
        </div>
        <button disabled={disableButton} className={disableButton? 'disabled' : ''} type="submit">Submit</button>
      </form>
    </div>
    );
}

export default Register;