import { useAppDispatch } from "../models/hooks"
import { ToasterSingleton, ToasterType } from "../models/toaster"
import { setHideToaster, setShowToaster } from "../store/showToaster.slice"

export const useToaster = () => {
    const dispatch = useAppDispatch()

    function openToaster(message:string, type?:ToasterType) {
        ToasterSingleton.init(message, type)

        dispatch(setShowToaster())

        setTimeout(() => {
            dispatch(setHideToaster())
            ToasterSingleton.cleanToaster()
        }, 3000)
    
    }

    return {
        openToaster
    }
}