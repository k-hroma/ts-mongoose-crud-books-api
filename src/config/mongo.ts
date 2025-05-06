import mongoose from 'mongoose'
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  const URI_DB = process.env.URI_DB || ""
  if (!URI_DB) {
    console.error("URI_DB no está definida en las variables de entorno.");
    process.exit(1);
  }

  try {
    await mongoose.connect(URI_DB, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Conectado a MongoDB con éxito");

  } catch (error) { 
    console.error("Falló conexión a base de datos", (error as Error).message)
    await new Promise((res) => { setTimeout(res, 100) });
    process.exit(1);
  }
}

export { connectDB }