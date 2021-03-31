export default abstract class CodigoError extends Error{
    codigo: number;
    constructor(msg: string, codigo?: number) {
        super(msg);
        if (codigo != undefined) {
            this.codigo = codigo;
        } else {
            this.codigo = 500;
        }
    }
}