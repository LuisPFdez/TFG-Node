
import { Usuario } from "../model/Usuario";

/**
 * El tipo stNull indica que la variable puede ser un string o un null
 */
type stNull = string | null;

/**
 * El tipo usNull indica que la variable puede ser un objeto de usuario o null
 */
type usNull = Usuario | null;

export { stNull, usNull };