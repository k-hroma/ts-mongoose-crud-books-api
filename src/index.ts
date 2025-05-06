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
interface IBook { 
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
const getBooks = async (): Promise<QueryResponse> => {
  try { 
    const books = await Book.find().lean()
    return createQueryResponse({
      success: true,
      message: books.length ? "Libros obtenidos con éxito" : "No hay libros registrados",
      data: books
    })
    
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Error desconocido";
    const statusCode = typeof (error as any)?.code === "number" ? (error as any).code : 500;
    return createQueryResponse({
      success: false,
      message: "Falló la obtención de libros",
      error: {
        details: errMsg,
        statusCode: statusCode
      }
    })
  }
}

// C. Obtener un libro por ID
const getBook = async (id: string): Promise<QueryResponse> => {
  try {
    const book = await Book.findById(id).lean()
    if (!book) {
      return createQueryResponse({
        success: false,
        message: "Libro no encontrado",
        error: {
          details: "No existe un libro con ese ID",
          statusCode: 404
        }
      });
    }
    return createQueryResponse({
      success: true,
      message: "Libro encontrado con éxito",
      data: book
    });
  } catch (error) { 
    const errMsg = error instanceof Error ? error.message : "Error desconocido";
    const statusCode = typeof (error as any).code === "number" ? (error as any).code : 500;
    return createQueryResponse({
      success: false,
      message: "Error al buscar el libro",
      error: {
        details: errMsg,
        statusCode: statusCode
      }
    })
  }
}
// C. Obtener libros por titulos
const getBookByTitle = async (title:string): Promise<QueryResponse> => {
  try { 
    const books = await Book.find({ title }).lean()
    if (books.length === 0) {
      return createQueryResponse({
        success: false,
        message: "El libro no existe o fue eliminado",
        error: {
          details: "No se encontraron libros con ese título",
          statusCode: 404
        }
      })
     }
    return createQueryResponse({
      success: true,
      message: "Libros encontrados con éxito",
      data: books
    })
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Error desconocido"
    const statusCode = typeof (error as any).code === "number" ? (error as any).code : 500
    return createQueryResponse({
      success: false,
      message: "Error al buscar por título",
      error: {
        details: errMsg,
        statusCode: statusCode
      }
    })
  }
}
 
// D. Actualizar libro por ID
const updateBook = async (id: string, data: BookUpdateInput):Promise<QueryResponse> => { 
  try {
    const updatedBook = await Book.findByIdAndUpdate(id, data, {new:true}).lean()
    if (!updatedBook) {
      return createQueryResponse({
        success: false,
        message: "Libro no encontrado",
        error: {
          details: "Id inexistente",
          statusCode: 404
        }
    }) }
    
    return createQueryResponse({
      success: true,
      message: "Libro actualizado con éxito",
      data: updatedBook
    })

  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Error desconocido";
    const statusCode = typeof (error as any).code === "number" ? (error as any).code : 500
    return createQueryResponse({
      success: false,
      message: "Error en la actualización del libro.",
      error: {
        details: errMsg,
        statusCode: statusCode
      }
    })
  }
}

// E. Eliminar un libro por ID
const deleteBook = async (id:string): Promise<QueryResponse> => { 
  try {
    const deletedBook = await Book.findByIdAndDelete(id).lean()
    
    if (!deletedBook) {
      return createQueryResponse({
        success: false,
        message: "El libro no existe o ya fue eliminado.",
        error: {
          details: "No se encontró un libro con ese ID.",
          statusCode: 404
        }
      })
    }

    return createQueryResponse({
      success: true,
      message: "Libro eliminado con éxito",
      data: deletedBook
    })

  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Error desconocido";
    const statusCode = typeof (error as any)?.code === "number" ? (error as any).code : 500;
    return createQueryResponse({
      success: false,
      message: "Error al eliminar el libro",
      error: {
        details: errMsg,
        statusCode:statusCode
      }
    })
  }
}

// === EJEMPLOS DE USO ===

const main = async() => {
  // const responseCreateBook = await createBook({ title: "Super cali", author: "Rocio", publishedYear: 1987, available: true })
  // console.log(responseCreateBook)
  // console.log("-----------------------------------------")

  // const responseGetBooks = await getBooks()
  // console.log(responseGetBooks)
  // console.log("-----------------------------------------")

  // const responseGetBook = await getBook("681a7031a4587ec1f285211d")
  // console.log(responseGetBook)
  // console.log("-----------------------------------------")

  // const responsedeleteBook = await deleteBook("681a13f5d5178713817d8539")
  // console.log(responsedeleteBook)
  // console.log("-----------------------------------------")
  
  // const responseGetBookByTitle = await getBookByTitle("")
  // console.log(responseGetBookByTitle)
  // console.log("-----------------------------------------")
  
  // const responseUpdateBook = await updateBook("6819f74663daffa6b49e699d", { title: "cualquiera" })
  // console.log(responseUpdateBook)
}
 
main()