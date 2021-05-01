import ObjetoUsuarioInterface from "./ObjetoUsuarioInterface";

/**
 * Interfaz que define las propiedades y metodos de la clase Usuario
 */
export default interface UsuarioInterface{
    codUsuario: string;
    password: string;
    descripcion: string;
    tipo: string;
    cambiarPassword(password: string):void;
    crearObjecto(): ObjetoUsuarioInterface;
}