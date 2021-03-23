export default class ErrorUsuario extends Error {
    codigo: number;
    constructor(msg: string, codigo?: number) {
        super(msg);
        this.name = "ErrorUsuario";
        if (codigo != undefined) {
            this.codigo = codigo;
        } else {
            this.codigo = 500;
        }
    }
}