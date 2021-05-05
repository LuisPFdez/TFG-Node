/**
 * @file Archivo de javascript comun para todas las paginas, se encarga
 * de definir las funciones necesarias
 * @author Luis Puente Fernández
 */
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Funcion que permite redirigir a otras paginas 
 * @param {string} url, url a la que se quiere mover
 */
function redirigir(url) {
    location.replace(url);
}