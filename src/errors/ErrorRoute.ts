import CodigoError from "./CodigoError";

export default class ErrorRoute extends CodigoError {
    constructor(msg: string, codigo?: number) {
        super(msg, codigo);
        this.name = "ErrorRoute";
    }
}