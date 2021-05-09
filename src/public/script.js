/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * @file Archivo de javascript comun para todas las paginas, se encarga
 * de definir las funciones necesarias
 * @author Luis Puente Fernández
*/

/**
 * Funcion que permite redirigir a otras paginas 
 * @param {string} url, url a la que se quiere mover
 */
function redirigir(url) {
    location.replace(url);
}

/**
 * Funcion que permite activar y desactivar un boton en funcion de que un input coincida con un codigo 
 * @param {HTMLElement} elemento, input desde que se llama al saltar el evento
 * @param {HTMLElement} boton, boton que ha de ser desactivado o activado
 * @param {HTMLElement} codigo, codigo para verificar con el texto del input
 */
function desactivarBoton(elemento, boton, codigo) {
    if (codigo.innerHTML == elemento.value){
        boton.disabled = false;
        boton.classList.replace('boton-des2', 'boton-confirm2');
    } else {
        boton.disabled = true;
        boton.classList.replace('boton-confirm2','boton-des2');
    }
}