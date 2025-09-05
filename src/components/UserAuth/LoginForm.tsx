import { useState } from "react"
import { useForm } from "react-hook-form"
import { Ids, LoginForm } from "../../models/types"
import { Socket } from "socket.io-client"
import { useAuth } from "../../hooks/useAuth"

interface LoginError {
    message: string,
    type: number
}

interface LoginFormProps {
    game_id?: Ids,
    socket?: Socket
}

const LoginFormC:React.FC<LoginFormProps> = ({game_id, socket}) => {
    const [useUsername, setUseUsername] = useState(true)
    const [disableButton, setDisableButton] = useState(true)
    const [loginError , setLoginError] = useState<LoginError | undefined>()
    const {register , handleSubmit , getValues , formState:{errors}} = useForm<LoginForm>()
    const { handleLogin } = useAuth()

    function handleLoginType(event: React.ChangeEvent<HTMLInputElement>):void {
        setUseUsername(event.target.checked);
    }
    function handleLoginType2(event: React.ChangeEvent<HTMLInputElement>):void {
        setUseUsername(!event.target.checked);
    }

    /**
     * Enables or disables the login button when the fields are filled or not respectively
     * @returns set the disabling button "disableButton" local state value
     */
    function validateButton () {
        setLoginError(undefined)

        const username = getValues('username')
        const email = getValues('email')
        const password = getValues('password')

        if ((useUsername? username : email) && password) {
            return setDisableButton(false)
        } else {        
            return setDisableButton(true)
        }
    }

    /**
     * The functions divides the login process into two stages. First, the classic login that returns an "access-token" cookie, but if successful the second stage is triggered. This one is a get api call for user authentication that sets global states such as "loggedIn", "role", or "gameSettings" when successful.
     * @param data Objet gotten from the form. Contains the username(string), email(string), password(string) and useUsername(boolean)
     */
    function loginSubmit (data:LoginForm) {
        let newData:LoginForm = {
            username: undefined,
            email: undefined,
            password: undefined,
            useUsername: undefined
        }

        //This variable allows us to tell the backend when to use the username or the email for the login
        if (useUsername) {
            newData['useUsername'] = true
            newData['username'] = data.username
        } else {
            newData['useUsername'] = false
            newData['email'] = data.email
        }
        newData['password'] = data.password

        handleLogin({data:newData, game_id, socket, setLoginError})
        // console.log(errors)
    }

    return (
        <form onSubmit={handleSubmit(loginSubmit)} className="login-form">
            <div className="input-container">
                <div className="label-container">
                    <label htmlFor="username">Username</label> 
                    <input className="checkbox" type="checkbox" name="username-check" checked={useUsername} onChange={handleLoginType}/>
                    <label htmlFor="email">e-mail</label>
                    <input className="checkbox" type="checkbox" name="email-check" checked={!useUsername} onChange={handleLoginType2}/>
                </div>

                {/* Custom Input */}
                    {useUsername ?
                        (
                            <div className="custom-input">
                                <input className="input-text" type="text" id="username" placeholder="Username"
                                {...register('username' , {required:true , onChange:validateButton})}/>
                                <div className="input-icon">
                                    <i className="fa-solid fa-user fa-xl"></i>
                                </div>
                            </div>
                        )
                            :
                        (
                            <div className="custom-input">
                                <input className="input-text" type="text" id="email" placeholder="E-mail"  
                                {...register('email' , {required:true , onChange:validateButton , pattern:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/})}
                                aria-invalid={errors.email ? 'true' : 'false'}/>
                                <div className="input-icon">
                                    <i className="fa-solid fa-envelope fa-xl"></i>
                                </div>
                            </div>
                        )
                    }
                {errors.email?.type === "pattern" && (
                <p className="form-error" role="alert">*Email format is not correct</p>
                )}
                {loginError?.type === 1 && (
                    <p className="form-error" role="alert">*{loginError.message}</p>
                )}
            </div>

            <div className="input-container">

                {/* Custom Input */}
                <div className="custom-input">
                    <input className="input-text" type="password" id="password" placeholder="Password"
                    {...register('password' , {required:true , onChange:validateButton , minLength:4 , maxLength:20})}
                    aria-invalid={errors.password ? 'true' : 'false'}/>
                    <div className="input-icon">
                        <i className="fa-solid fa-key fa-xl"></i>
                    </div>
                </div>
                {errors.password?.type === "minLength" && (
                    <p className="form-error" role="alert">*Password's min length is 8 characters</p>
                )}
                {errors.password?.type === "maxLength" && (
                    <p className="form-error" role="alert">*Password's max length is 8 characters</p>
                )}
                {loginError?.type === 2 && (
                    <p className="form-error" role="alert">*{loginError.message}</p>
                )}
            </div>

            <button disabled={disableButton} className={disableButton? 'disabled' : ''} type="submit">Inciar Sesión</button>

            <p className="advertisement">Don't have an account? <a href="#/register">Sign Up</a></p>
        </form>
    )
}

export default LoginFormC