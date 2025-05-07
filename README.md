
# 📚 ts-mongoose-crud-books-api

Una API backend básica desarrollada en **TypeScript**, usando **Mongoose** para interactuar con una base de datos **MongoDB**, que permite realizar operaciones CRUD sobre una colección de libros.

## 🚀 Tecnologías utilizadas

- TypeScript
- Node.js
- Mongoose
- MongoDB

## 📦 Instalación

1. Cloná el repositorio:

```bash
git clone https://github.com/tu-usuario/ts-mongoose-crud-books-api.git
cd ts-mongoose-crud-books-api
```

2. Instalá las dependencias:

```bash
npm install
```

3. Configurá tu archivo `.env` con tu cadena de conexión a MongoDB:

```env
MONGO_URI=mongodb://localhost:27017/nombre-de-tu-db
```

4. Ejecutá el proyecto:

```bash
npm run dev
```

## 🧩 Funcionalidades

- Crear libros
- Obtener todos los libros
- Obtener un libro por ID o por título
- Actualizar un libro por ID
- Eliminar un libro por ID
- Respuestas estandarizadas

## 🗂️ Estructura básica

```
├── .env.example # Ejemplo de archivo de configuración de variables de entorno
├── .gitignore # Archivos y carpetas a excluir de Git
├── package.json # Dependencias y scripts del proyecto
├── package-lock.json # Versión exacta de las dependencias instaladas
├── tsconfig.json # Configuración de TypeScript
├── src/
│ ├── config/
│ │ └── mongo.ts # Conexión a MongoDB
│ └── index.ts # Lógica principal y funciones CRUD
```

## 🧪 Ejecución de pruebas simples

La función `main()` al final del archivo `index.ts` contiene ejemplos de uso de las funciones CRUD. Podés modificarla para probar diferentes operaciones.

## ✍️ Autor

Desarrollado por [Khroma](https://github.com/k-hroma)
