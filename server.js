import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

// Ruta básica para probar que el server está vivo
app.get("/", (req, res) => {
  res.send("Servidor WebSocket activo 🚀");
});

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://departamento-sistemasips.vercel.app",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`Usuario ${socket.id} entró a la sala ${room}`);
  });

  socket.on("leave_room", (room) => {
    socket.leave(room);
    console.log(`Usuario ${socket.id} salió de la sala ${room}`);
  });

  socket.on("enviar_mensaje", (data) => {
    io.to(data.reporte_id).emit("recibir_mensaje", data);
  });
});

// Render te asigna el puerto con process.env.PORT
const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Servidor WebSocket corriendo en http://localhost:${PORT}`);
});
