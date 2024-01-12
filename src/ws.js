import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import tmi from 'tmi.js';

const app = express();
const port = process.env.PORT || 3001;

// Configuración del cliente de Twitch
const twitchClient = new tmi.Client({
  options: { debug: true },
  connection: {
    secure: true,
    reconnect: true,
  },
  channels: ['hanncitaa'], // Reemplaza con tu nombre de canal
});

// Crear un servidor HTTP
const server = http.createServer(app);

// Crear un servidor WebSocket
const wss = new WebSocket.Server({ server });

// Manejar conexiones WebSocket
wss.on('connection', (ws) => {
  console.log('Conexión WebSocket establecida');

  let previousMessage = '';

  // Manejar mensajes del chat y enviarlos a través de WebSocket
  twitchClient.on('message', (channel, userstate, message, self) => {
    if (self) return; // Ignorar mensajes propios

    const chatMessage = `${userstate.username}: ${message}`;
    
    // Verificar si el mensaje es igual al anterior
    if (chatMessage !== previousMessage) {
      console.log(chatMessage);

      // Enviar el mensaje a través de WebSocket a todos los clientes conectados
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          try {
            client.send(chatMessage);
            console.log('Mensaje enviado al WebSocket:', chatMessage);
          } catch (error) {
            console.error('Error al enviar mensaje al WebSocket:', error);
          }
        }
      });

      // Actualizar el mensaje anterior
      previousMessage = chatMessage;
    }
  });
});


  // Manejar errores en la conexión WebSocket
  ws.on('error', (error) => {
    console.error('Error en la conexión WebSocket:', error);
  });

  // También puedes manejar mensajes recibidos desde el front-end
  ws.on('message', (message) => {
    console.log(`Mensaje recibido desde el front-end: ${message}`);
    // Puedes realizar acciones adicionales aquí según tus necesidades
  });
});

// Manejar errores en la conexión del cliente de Twitch
twitchClient.on('connected', (address, port) => {
  console.log(`Conectado al servidor de Twitch en ${address}:${port}`);
});

twitchClient.on('disconnected', (reason) => {
  console.error('Desconectado del servidor de Twitch:', reason);
});

// Iniciar el servidor
server.listen(port, () => {
  console.log(`Servidor de Chat de Twitch escuchando en http://localhost:${port}`);
});

// Conectar al chat de Twitch después de que el servidor se haya iniciado
server.on('listening', () => {
  twitchClient.connect();
});
