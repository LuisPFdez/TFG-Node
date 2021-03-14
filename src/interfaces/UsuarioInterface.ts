import ObjetoUsuarioInterface from "./ObjetoUsuarioInterface";

export default interface UsuarioInterface{
    codUsuario: string;
    password: string;
    descripcion: string;
    tipo: string;
    cambiarPassword(password: string):void;
    crearObjecto(): ObjetoUsuarioInterface;
}