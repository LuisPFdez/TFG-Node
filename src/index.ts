import express, { Request, Response } from 'express';
import Usuario from "./model/Usuario";
try {
    var prueba: Usuario = new Usuario("Admin", "paso", "prueba", "Admin");
    console.log(prueba);
} catch (error) {
    console.log("error");
}
