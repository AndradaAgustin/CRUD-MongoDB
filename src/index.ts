import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017");

await client.connect();

const db = client.db("biblioteca");
const librosCC = db.collection("libros");

const argumentos = process.argv.slice(2);
const accion = argumentos[0];
const id = argumentos[1];

interface ILibro {
    titulo: string;
    autor: string;
    precio: number;
    stock: number;
}

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

// LEER
const leerLibros = async () => {
    return await librosCC.find().toArray();
};

// ACTUALIZAR
const actualizarLibro = async (
    id: string,
    titulo: string,
    autor: string,
    precio: number,
    stock: number
) => {
    if (!id) {
        return "ID obligatorio para actualizar el libro";
    }

    if (!ObjectId.isValid(id)) {
        return "El ID proporcionado no es válido";
    }

    const resultado = await librosCC.updateOne(
        { _id: new ObjectId(id) },
        {
            $set: {
                titulo,
                autor,
                precio,
                stock
            }
        }
    );

    if (resultado.matchedCount === 0) {
        return "No se encontró ningún libro con ese ID";
    }

    return await librosCC.findOne({
        _id: new ObjectId(id)
    });
};

// ELIMINAR
const borrarLibro = async (id: string) => {
    if (!id) {
        return "ID obligatorio para borrar el libro";
    }

    if (!ObjectId.isValid(id)) {
        return "El ID proporcionado no es válido";
    }

    const resultado = await librosCC.deleteOne({
        _id: new ObjectId(id)
    });

    if (resultado.deletedCount === 0) {
        return "No se encontró ningún libro con ese ID";
    }

    return "Libro eliminado correctamente ✅";
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

    case "update":
        const tituloActualizar = argumentos[2];
        const autorActualizar = argumentos[3];
        const precioActualizar = Number(argumentos[4]);
        const stockActualizar = Number(argumentos[5]);

        console.log(
            await actualizarLibro(
                id,
                tituloActualizar,
                autorActualizar,
                precioActualizar,
                stockActualizar
            )
        );

        process.exit(0);
        break;

    case "delete":
        console.log(await borrarLibro(id));

        process.exit(0);
        break;

    default:
        console.log("Comando no existente. Utiliza 'help' para ver los comandos.");
}