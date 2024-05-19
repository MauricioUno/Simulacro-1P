class Auto
{
    constructor(id,titulo,transaccion, descripcion, precio, puertas, kms, potencia)
    {
        this.id = id;
        this.titulo = titulo;
        this.transaccion = transaccion;
        this.descripcion = descripcion;
        this.precio = precio;
        this.puertas = puertas;
        this.kms = kms;
        this.potencia = potencia;
    }

    validarDatos()
    {
        return true;
    }
    
}


export { Auto };