import { Request, Response, Router } from "express";


import { autenticado } from "../controller/auth";
const rutas = Router();

rutas.get("/inicio", autenticado, (req: Request, res: Response) => {
    res.send("Hola, " + req.session.usuario?.descripcion);
});

export default rutas;