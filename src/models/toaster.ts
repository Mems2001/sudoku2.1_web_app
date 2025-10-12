export type ToasterType = "regular" | "error"

interface ToasterData {
    message?: string,
    type?: ToasterType
}

export class ToasterSingleton {
    private static instance: ToasterSingleton
    private _message: string = "No message"
    private _type: ToasterType = "regular"
    public static toasterQueue:ToasterData[] = []

    constructor () {
        
    }

    static init() {
        if (!ToasterSingleton.instance) {
            ToasterSingleton.instance = new ToasterSingleton()
        }
    }

    static setToasterData (message?:string, type?:ToasterType) {
        if (message) this.instance._message = message
        if (type) this.instance._type = type
    }

    static cleanToaster() {
        this.setToasterData("No message", "regular")
    }

    static get message() {
        return this.instance._message
    }

    static get type() {
        return this.instance._type
    }
}