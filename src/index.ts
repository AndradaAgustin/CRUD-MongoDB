import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017");

await client.connect();

const argumentos = process.argv.slice(2);
const accion = argumentos[0];
const id = argumentos[1];

const db = client.db("biblioteca");
const librosCC = db.collection("libros");

interface ILibro {
    titulo: string;
    autor: string;
    precio: number;
    stock: number;
}

// LEER
const leerLibros = async () => {
    return await librosCC.find().toArray();
};

// CREAR
const agregarLibro = async (
    titulo: string,
    autor: string,
    precio: number,
    stock: number
) => {
    const nuevoLibro: ILibro = {
        titulo,
        autor,
        precio,
        stock
    };

    const resultado = await librosCC.insertOne(nuevoLibro);

    return await librosCC.findOne({
        _id: resultado.insertedId
    });
};

// COMANDOS
switch (accion) {

    case "help":
        console.log(`
        read → mostrar todos los libros
        create "titulo" "autor" precio stock → crear un libro
        update ID "titulo" "autor" precio stock → actualizar un libro
        delete ID → eliminar un libro
        `);
        break;

    case "read":
        const libros = await leerLibros();

        console.log("Libros:", libros);

        process.exit(0);
        break;

    case "create":
        const tituloCrear = argumentos[1];
        const autorCrear = argumentos[2];
        const precioCrear = Number(argumentos[3]);
        const stockCrear = Number(argumentos[4]);

        console.log(
            await agregarLibro(
                tituloCrear,
                autorCrear,
                precioCrear,
                stockCrear
            )
        );

        process.exit(0);
        break;
}