import { connectDB } from "./config/mongo";
import { Schema, model, Document } from "mongoose";

// 1. Conectar a la base de datos
connectDB()

// 2. Interfaces

// A. Respuesta estándar
interface QueryResponse {
  success: boolean
  message: string
  data?: IBook | IBook[] | null
  error?: {
    details: string
    statusCode: number
  } | null
}

// B. Documento del libro
interface IBook extends Document { 
  title: string,
  author: string,
  publishedYear: number,
  available:boolean
}

// C. Entrada para creación
interface BookInput { 
  title: string,
  author: string,
  publishedYear: number,
  available?:boolean
}

// D. Entrada para actualización
interface BookUpdateInput { 
  title?: string,
  author?: string,
  publishedYear?: number,
  available?:boolean
}

// 3. Esquema de Mongoose
const BookSchema = new Schema<IBook>({
  title: {type:String, required:true, unique: true},
  author: {type:String, required:true},
  publishedYear: {type:Number, required:true},
  available: {type:Boolean, default:true}
}, {versionKey:false, timestamps: true,})

// 4. Modelo de Mongoose
const Book = model<IBook>("Book", BookSchema)


// 5. Utilidad para crear una respuesta estándar
const createQueryResponse = ({
  success,
  message,
  data = null,
  error = null
}: QueryResponse): QueryResponse => {
  return { success, message, data, error }
}

// 6. Funciones CRUD

// A. Crear un libro
const createBook = async (data:BookInput): Promise<QueryResponse> => { 
  try { 
    const book = new Book( data )
    const addedBook = await book.save()
    return createQueryResponse({
      success: true,
      message: "Libro creado exitosamente",
      data: addedBook
    })
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Error desconocido";
    const statusCode = typeof (error as any)?.code === "number" ? (error as any).code : 500;
    return createQueryResponse({
      success: false,
      message: "Falló creación de libro",
      error: {
        details: errMsg,
        statusCode: statusCode
      }
    })
  }
}

// B. Obtener todos los libros
const getBooks = async (): Promise<void> => {
  try { 
    const books = await Book.find().lean()
    console.log("Libros encontrados: ",books)
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error al actualizar el libro: ", error.message);
    } else {
      console.error("Error desconocido: ", error);
    }
  }
}

// C. Obtener un libro por ID
const getBook = async (id:string): Promise<void> => {
  try { 
    const book = await Book.findById(id).lean()
    if (!book) {
      console.warn("Libro no encontrado")
    } else { 
      console.log("Libro encontrado: ", book)
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error al actualizar el libro: ", error.message);
    } else {
      console.error("Error desconocido: ", error);
    }
  }
}

// C. Obtener libros por titulos
const getBookByTitle = async (title:string): Promise<void> => {
  try { 
    const books = await Book.find({ title }).lean()
    if (books.length === 0) {
      console.warn("No se encontraron libros con ese título.")
    } else { 
      console.log("Libros encontrados: ", books)
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error al actualizar el libro: ", error.message);
    } else {
      console.error("Error desconocido: ", error);
    }
  }
}
 
// D. Actualizar libro por ID
const udpdateBook = async (id: string, data: BookUpdateInput):Promise<void> => { 
  try {
    const updatedBook = await Book.findByIdAndUpdate(id, data, {new:true}).lean()
    if (!updatedBook) { console.warn("Libro no encontrado para actualización.") }
    else { 
      console.log("Libro actualizado: ", updatedBook)
    }
   } catch (error) {
    if (error instanceof Error) {
      console.error("Error al actualizar el libro: ", error.message);
    } else {
      console.error("Error desconocido: ", error);
    }
  }
}

// E. Eliminar un libro por ID
const deleteBook = async (id:string): Promise<void> => { 
  try {
    const deletedBook = await Book.findByIdAndDelete(id).lean()
    if (!deletedBook) { console.warn("Libro no encontrado.") }
    else { console.log("Libro eliminado:", deletedBook) }
   } catch (error) {
    if (error instanceof Error) {
      console.error("Error al eliminar el libro: ", error.message);
    } else {
      console.error("Error desconocido: ", error);
    }
  }
}



// === EJEMPLOS DE USO ===

const main = async() => {
  const response = await createBook({ title: "Chanchos voladores", author: "Rocio", publishedYear: 1987, available: true })
  console.log(response)
  await deleteBook("3")
}
 
main()