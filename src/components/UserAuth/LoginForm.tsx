import { useState } from "react"
import { useAppDispatch } from "../../app/hooks"
import { useForm } from "react-hook-form"
import { Ids, LoginForm } from "../../app/types"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import variables from '../../../utils/variables'
import { setLoggedIn, setLoggedOut } from "../../features/isLogged.slice"
import { setRole } from "../../features/role.slice"
import { Socket } from "socket.io-client"

interface LoginError {
    message: string,
    type: number
}

interface LoginFormProps {
    game_id?: Ids,
    socket?: Socket
}

const LoginFormC:React.FC<LoginFormProps> = ({game_id, socket}) => {
    const dispatch = useAppDispatch()
    const [useUsername, setUseUsername] = useState(true)
    const [disableButton, setDisableButton] = useState(true)
    const [loginError , setLoginError] = useState<LoginError | undefined>()
    const {register , handleSubmit , getValues , formState:{errors}} = useForm<LoginForm>()
    const navigate = useNavigate()

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

        const URL = variables.url_prefix + '/api/v1/auth/login';
        const URL2 = variables.url_prefix + '/api/v1/auth/authenticate_session';
        axios.post(URL , newData)
            .then(res => {
                console.log(res.data.message , res.status)
                axios.get(URL2)
                .then((response) => {
                    console.log(response.data.message , response.status)
                    if (response.status == 200) {
                        dispatch(setLoggedIn())
                        dispatch(setRole(response.data.role))
                        if (game_id) socket?.emit('create-player', response.data.user_id, game_id)
                    } else {
                        dispatch(setLoggedOut())
                        
                    }
                    if (!game_id) navigate('/')
                })
                .catch((error) => {
                    console.error('Error:', error)
                    dispatch(setLoggedOut())
                })
            })
            .catch(err => {
                console.error('Error:', err)
                setLoginError(err.response.data)
            })
        // console.log(errors)
    }

    return (
        <form onSubmit={handleSubmit(loginSubmit)} className="login-form">
            <div className="input-container">
                <div className="label-container">
                    <input className="checkbox" type="checkbox" checked={useUsername} onChange={handleLoginType}/>
                    <label htmlFor="username">Username</label> 
                    <input className="checkbox" type="checkbox" checked={!useUsername} onChange={handleLoginType2}/>
                    <label htmlFor="email">e-mail</label>
                </div>
                {useUsername ? 
                    <input type="text" id="username" placeholder="Type your username"
                    {...register('username' , {required:true , onChange:validateButton})}/>
                    :
                    <input type="text" id="email" placeholder="Type your e-mail"  
                    {...register('email' , {required:true , onChange:validateButton , pattern:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/})}
                    aria-invalid={errors.email ? 'true' : 'false'}/>
                }
                {errors.email?.type === "pattern" && (
                <p className="form-error" role="alert">*Email format is not correct</p>
                )}
                {loginError?.type === 1 && (
                    <p className="form-error" role="alert">*{loginError.message}</p>
                )}
            </div>
            <div className="input-container">
                <label htmlFor="password">
                    Password:
                </label>
                <input type="password" id="password" placeholder="Type a password"
                {...register('password' , {required:true , onChange:validateButton , minLength:4 , maxLength:20})}
                aria-invalid={errors.password ? 'true' : 'false'}/>
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
        </form>
    )
}

export default LoginFormC