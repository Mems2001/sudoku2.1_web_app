import { useSelector } from "react-redux"
import { RootState } from "../store/store"
import Logo from "./Shared/Logo"
import { ToasterSingleton, ToasterType } from "../models/toaster"

const Toaster = () => {
    ToasterSingleton.init()
    const showToaster = useSelector((state:RootState) => state.showToaster.value)
    const showToasterClass = showToaster ? "show-toaster" : ""
    const type = ToasterSingleton.type
    const message = ToasterSingleton.message

    function handleToasterType(type: ToasterType) {
        switch (type) {
            case "regular":
                return `toaster-container ${showToasterClass} toaster-regular`
            case "error":
                return `toaster-container ${showToasterClass} toaster-error`
        }
    }

    return (
        <div className={handleToasterType(type)}>
            {type === "regular" ? 
                <Logo size="small"/>
                    :
                <div className="error-icon">
                    <i className="fa-solid fa-circle-xmark fa-2xl"></i>
                </div>
            }
            <p>{message}</p>
        </div>
    )
}

export default Toaster