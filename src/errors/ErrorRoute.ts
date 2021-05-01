import CodigoError from "./CodigoError";

/**
 * Excepcion para los errores relacionados con las rutas
 * @extends CodigoError 
 */
export default class ErrorRoute extends CodigoError {
   
    /**
     * @param msg mensaje del error
     * @param codigo codigo de error HTTP, opcional
     */
    constructor(msg: string, codigo?: number) {
        super(msg, codigo);
        this.name = "ErrorRoute";
    }
}