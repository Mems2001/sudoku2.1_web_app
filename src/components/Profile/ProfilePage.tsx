import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { ProfilesServices } from "../../services/ProfilesServices"
import { ProfileData } from "../../models/dbTypes"
import { useNavigate } from "react-router-dom"
import GameStatsComponent from "./GameStatsComponent"

interface ProfileForm {
    username: string,
    email: string
}

function ProfilePage() {
    const [edit, setEdit] = useState<boolean>(false)
    const [profile, setProfile] = useState<ProfileData|null>(null)
    const {register} = useForm<ProfileForm>()

    const navigate = useNavigate()

    useEffect(() => {
        ProfilesServices.getMyProfile()
            .then(response => {
                console.warn(response.data)
                setProfile(response.data)
            })
            .catch(error => {
                console.error(error)
            })
    }, [])

    return (
        <section className="profile-page">
            <div className="profile-container">
                <form className="profile-card">
                    <div className="profile-avatar-container">
                        <div className="avatar-container">
                            <i className="fa-solid fa-user-secret"></i>
                        </div>
                    </div>
                    <label className="input-container">
                        {edit && (
                            <span>username</span>
                        )}
                        <input id="profile-username" type="text" disabled={!edit} defaultValue={profile?.User.username} {...register('username')} placeholder="username"/>
                    </label>
                    <label className="input-container">
                        {edit && (
                            <span>email</span>
                        )}
                        <input id="profile-email" type="text" disabled={!edit} defaultValue={profile?.User.email} {...register('email')} placeholder="email"/>
                    </label>
                    <button className="profile-edit-button" type="button" onClick={() => setEdit(prev => !prev)}>
                        {edit? (
                            <i className="fa-solid fa-floppy-disk fa"></i>
                        ) : (
                            <i className="fa-solid fa-pen-to-square fa"></i>
                        )}
                    </button>
                </form>

                {profile && profile.game_stats && (
                    <GameStatsComponent game_stats={profile.game_stats}/>
                )}

                <button type="button" className="home-button user" onClick={() => navigate('/')}>
                    <i className="fa-solid fa-house"></i>
                </button>
            </div>
        </section>
    )
}

export default ProfilePage