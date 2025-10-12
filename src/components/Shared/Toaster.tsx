import Logo from "./Logo"
import {motion} from 'framer-motion'

import { ToasterSingleton, ToasterType } from "../../models/toaster"
import { ToasterAnimationProps } from "../../assets/animations"

const Toaster = () => {
    ToasterSingleton.init()
    const type = ToasterSingleton.type
    const message = ToasterSingleton.message

    function handleToasterType(type: ToasterType) {
        switch (type) {
            case "regular":
                return `toaster-container toaster-regular`
            case "error":
                return `toaster-container toaster-error`
        }
    }

    return (
        <motion.div className={handleToasterType(type)}
        {...ToasterAnimationProps}>
            {type === "regular" ? 
                <Logo size="small"/>
                    :
                <div className="error-icon">
                    <i className="fa-solid fa-circle-xmark fa-2xl"></i>
                </div>
            }
            <p>{message}</p>
        </motion.div>
    )
}

export default Toaster