/**
 * ---------------------------------------------------------------------------------------------------------------------------------------------------
 *                           La libreria base de php, tiene ciertos problemas en la lógica que pueden ocasionar cierto problemas.                     
 *                                       Estos errores no se han corregido al ser adaptada a typescript                                               
 * ---------------------------------------------------------------------------------------------------------------------------------------------------
 * @file Fichero con la clase validacionFormulario, que contiene funciones para validar los campos de los formularios
 * La clase es una adaptación de https://github.com/JavierNLSauces/libreriaValidacion. Se adaptan los metodos necesarios para la aplicación
 * Tambien contiene el tipo stNull.
 * @author Luis Puente Fernández
 * 
 */

/**
 * El tipo es redefinido para evitar que la libreria sea dependientre del proyecto
 */
type stNull = string | null;



export default class validacionFormuarios {

    /**
     * @method concatenar comprueba si el parametro texto es null o no, evita que si texto es null se concatene con el mensaje
     * @param texto puede ser null o un string, es la variable a la que se va a concatenar el mensaje
     * @param mensaje puede ser null o string. Si ambos son null se devolvera null
     * @returns stNull (string o null), dependiendo de si alguno o ambos son string, o ambos son null
     */
    private static concatenar(texto: stNull, mensaje: stNull): stNull {
        if (texto == null && mensaje != null) { //Si solo es null la variable texto se devolverá la variable mensaje
            return mensaje;
        } else if (texto != null && mensaje == null) {//En caso de ser null mensaje se delvolvera texto
            return texto;
        } else if (texto == null && mensaje == null) {//Si ambas son null se retorna null
            return null;
        }
        // En caso de llegar hasta este punto, se supone que ninguna de las dos variables es null. 
        // Se hace un casting a string de ambas y se concatenan
        return texto as string + mensaje as string; // 
    }

    /**
     * Funcion que comprobrobará si la cadena esta compuesto por caracteres unicamente alfabéticos 
     * @param cadena string, cadena a comprobar
     * @param maxTamanio number, tamaño máximo de caracteres permitidos
     * @param minTamanio number, tamaño mínimo de caracteres permitidos
     * @param obligatorio 
     * @returns stNull (string o null), null en caso de ningun fallo y string en caso haber algun fallo
     */
    public static comprobarAlfabetico(cadena: string, maxTamanio: number = 1000, minTamanio: number = 1, obligatorio: boolean = true): stNull {
        let mensajeError: stNull = null;
        const regex = new RegExp("^[a-zA-ZáéíóúÁÉÍÓÚäëïöüÄËÏÖÜàèìòùÀÈÌÒÙñÑ ]+$");
        cadena = cadena.trim();

        if (obligatorio) {
            mensajeError = this.comprobarNoVacio(cadena);
        }

        if (!regex.test(cadena)) {
            mensajeError = this.concatenar(mensajeError, "Solo se admiten letras.");
        }

        mensajeError = this.concatenar(mensajeError, this.comprobarMaxTamanio(cadena, maxTamanio));
        mensajeError = this.concatenar(mensajeError, this.comprobarMinTamanio(cadena, minTamanio));
        return mensajeError;

    }

    public static comprobarAlfaNumerico(cadena: string, maxTamanio: number = 1000, minTamanio: number = 1, obligatorio: boolean = true): stNull {
        let mensajeError: stNull = null;
        cadena = cadena.trim();

        if (obligatorio) {
            mensajeError = this.comprobarNoVacio(cadena);
        }

        mensajeError = this.concatenar(mensajeError, this.comprobarMaxTamanio(cadena, maxTamanio));
        mensajeError = this.concatenar(mensajeError, this.comprobarMinTamanio(cadena, minTamanio));
        return mensajeError;
    }

    public static validarPassword(passwd: string, maximo: number = 16, minimo: number = 2, tipo: number = 2, obligatorio: boolean = true): stNull {  //CAMBIADO ORDEN DE LOS PARAMETROS, AÑADIDOS PARAMETROS PREDEFINIDOS Y MEJORADA LA RESPUESTA
        let mensajeError: stNull = null;
        if (obligatorio) {
            mensajeError = this.comprobarNoVacio(passwd);
        }
        if (passwd.length < minimo && passwd) {
            mensajeError = this.concatenar(mensajeError, " La contraseña debe ser de al menos " + minimo + " caracteres.");
        }
        if (passwd.length > maximo && passwd) {
            mensajeError = this.concatenar(mensajeError, " La contraseña debe tener como maximo " + maximo + " caracteres.");
        }
        if (passwd && mensajeError == null) {
            switch (tipo) {
                case 1:
                    mensajeError = this.concatenar(mensajeError, this.comprobarAlfabetico(passwd, maximo, minimo, obligatorio));
                    break;
                case 2:
                    mensajeError = this.concatenar(mensajeError, this.comprobarAlfaNumerico(passwd, maximo, minimo, obligatorio));
                    break;
                case 3:
                    if ((! /[A-Z]/.test(passwd) || ! /[0-9]/.test(passwd)) && passwd) {
                        mensajeError = this.concatenar(mensajeError, " La contraseña debe contener una mayúscula y un número.");
                    }
                    break;
            }
        }

        return mensajeError;
    }

    public static comprobarMaxTamanio(cadena: string, tamanio: number): stNull {
        let mensajeError: stNull = null;

        if (cadena.length > tamanio) {
            mensajeError = " El tamaño máximo es de " + tamanio + " caracteres.";
        }

        return mensajeError;
    }

    public static comprobarMinTamanio(cadena: string, tamanio: number): stNull {
        let mensajeError: stNull = null;

        if (cadena.length < tamanio) {
            mensajeError = " El tamaño minimo es de " + tamanio + " caracteres.";
        }

        return mensajeError;
    }

    public static comprobarNoVacio(cadena: string): stNull {
        let mensajeError: stNull = null;
        cadena = cadena.trim();
        if (cadena.length == 0) {
            mensajeError = "Campo Vacio.";
        }
        return mensajeError;
    }
}