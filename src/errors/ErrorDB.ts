export default class ErrorDB extends Error {
    codigo: number;
    constructor(msg: string, codigo?: number) {
        super(msg);
        this.name = "ErrorDB";
        if (codigo != undefined) {
            this.codigo = codigo;
        } else {
            this.codigo = 500;
        }
    }
}