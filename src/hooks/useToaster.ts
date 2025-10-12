import { useAppDispatch } from "../models/hooks"
import { ToasterSingleton, ToasterType } from "../models/toaster"
import { setHideToaster, setShowToaster } from "../store/showToaster.slice"

export const useToaster = () => {
    const dispatch = useAppDispatch()

    function openToaster(message?:string, type?:ToasterType) {
        ToasterSingleton.init()
        if (message) ToasterSingleton.toasterQueue.push({message, type})

        if (ToasterSingleton.message !== 'No message') {
            setTimeout(() => {
                return openToaster()
            }, ToasterSingleton.toasterQueue.length * 3500)
        } else {
            return displayToaster()
        }
    }

    function displayToaster() {
        if (ToasterSingleton.toasterQueue.length > 0) {
            const toaster_data = ToasterSingleton.toasterQueue.shift()
            console.warn(toaster_data, ToasterSingleton.toasterQueue)
            ToasterSingleton.setToasterData(toaster_data!.message, toaster_data!.type)
    
            dispatch(setShowToaster())
    
            setTimeout(() => {
                dispatch(setHideToaster())
                ToasterSingleton.cleanToaster()
            }, 3000)
        }
    }

    return {
        openToaster
    }
}