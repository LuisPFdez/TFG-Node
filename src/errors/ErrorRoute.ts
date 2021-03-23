export default class ErrorRoute extends Error {
    codigo: number;
    constructor(msg: string, codigo?: number) {
        super(msg);
        this.name = "ErrorRoute";
        if (codigo != undefined) {
            this.codigo = codigo;
        } else {
            this.codigo = 500;
        }
    }
}