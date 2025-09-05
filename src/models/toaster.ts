export type ToasterType = "regular" | "error"

export class ToasterSingleton {
    private static instance: ToasterSingleton
    private _message: string = "No message"
    private _type: ToasterType = "regular"

    constructor () {
        
    }

    static init(message?:string, type?:ToasterType) {
        if (!ToasterSingleton.instance) {
            ToasterSingleton.instance = new ToasterSingleton()
        }

        if (message) this.instance._message = message
        if (type) this.instance._type = type
    }

    static cleanToaster() {
        this.init("No message", "regular")
    }

    static get message() {
        return this.instance._message
    }

    static get type() {
        return this.instance._type
    }
}