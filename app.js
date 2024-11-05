const express = require('express');
const cors = require('cors'); // Importando o pacote cors
const photographersRoutes = require('./routes/photographers');
const foldersRoutes = require('./routes/folders');
const albumsRoutes = require('./routes/albums');
const photosRoutes = require('./routes/photos');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para habilitar CORS
app.use(cors()); // Habilita CORS para todas as rotas

// Middleware para analisar o corpo da requisição
app.use(express.json()); // Para JSON
app.use(express.urlencoded({ extended: true })); // Para dados URL-encoded

// Swagger configuration
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Snap Share API',
            version: '1.0.0',
            description: 'API for managing photographers, folders, albums, and photos',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
    },
    apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Routes
app.use('/photographers', photographersRoutes);
app.use('/folders', foldersRoutes);
app.use('/albums', albumsRoutes);
app.use('/photos', photosRoutes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});