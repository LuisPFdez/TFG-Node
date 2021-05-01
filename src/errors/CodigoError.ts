/**
 * Excepcion encargada de definir a las demas Excepciones
 */

export default abstract class CodigoError extends Error{
    //Codigo de error
    codigo: number;
    
    /**
     * @param msg mensaje del error
     * @param codigo codigo de error HTTP, opcional
     */
    constructor(msg: string, codigo?: number) {
        super(msg);
        //Comprueba si el codigo esta definido, si no le asigna el codigo 500
        if (codigo != undefined) {
            this.codigo = codigo;
        } else {
            this.codigo = 500;
        }
    }
}