class ErrorDB extends Error {
    constructor(msg = "Error, algo ha fallado con la base de datos") {
        super(msg);
        this.name = "ErrorDB";
    }
}

module.exports = ErrorDB;