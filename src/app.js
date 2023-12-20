// Importa las bibliotecas necesarias
import express from 'express';
import http from 'http';

// Crea una instancia de la aplicación Express
const app = express();
const port = 3000;

// Middleware para servir archivos estáticos (como tu página HTML)
app.use(express.static('public'));

// Ruta raíz que responde con "¡Hola, mundo!"
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

// Crea un servidor HTTP y escucha en el puerto especificado
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Servidor HTTP escuchando en http://localhost:${port}`);
});
