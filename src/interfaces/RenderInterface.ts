/**
 * Interfaz que define las propiedades necesarias para un objeto que se pasará como opcion para el renderizado
 */
export default interface RenderInterface {
    titulo: string;
    archivo: string;
    datos?: Record<string, unknown>;
}