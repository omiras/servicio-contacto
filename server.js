"use strict";

const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

const LIMITES = {
  name: 60,
  email: 254,
  message: 500
};

app.use(express.urlencoded({ extended: false, limit: "10kb" }));
app.use(express.json({ limit: "10kb" }));

function esTexto(valor) {
  return typeof valor === "string";
}

function esCorreoValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escaparHtml(texto) {
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function crearPagina(titulo, mensajeHtml, esError = false) {
  const color = esError ? "#a83232" : "#2f6f61";

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escaparHtml(titulo)}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 24px;
      color: #27332f;
      background-color: #ffffff;
      font-family: Arial, Verdana, sans-serif;
    }
    main {
      padding: 18px 22px;
      background-color: #f7f3ec;
      border-left: 5px solid ${color};
    }
    h1 {
      margin-top: 0;
      color: ${color};
      font-size: 1.5rem;
    }
    p {
      margin-bottom: 0;
      font-size: 1.1rem;
    }
  </style>
</head>
<body>
  <main>
    <h1>${escaparHtml(titulo)}</h1>
    <p>${mensajeHtml}</p>
  </main>
</body>
</html>`;
}

function responderHtml(res, estado, titulo, mensaje, esError = false) {
  return res
    .status(estado)
    .type("html")
    .send(crearPagina(titulo, escaparHtml(mensaje), esError));
}

app.get("/", (req, res) => {
  return responderHtml(
    res,
    200,
    "Huellas Felices",
    "Servicio de contacto disponible."
  );
});

app.get("/salud", (req, res) => {
  res.json({ estado: "ok" });
});

app.post("/contacto", (req, res) => {
  const { name, email, message } = req.body;

  if (!esTexto(name) || name.trim().length === 0) {
    return responderHtml(
      res,
      400,
      "Error en el campo name",
      "El nombre es obligatorio.",
      true
    );
  }

  const nameLimpio = name.trim();

  if (nameLimpio.length > LIMITES.name) {
    return responderHtml(
      res,
      400,
      "Error en el campo name",
      `El nombre no puede superar los ${LIMITES.name} caracteres.`,
      true
    );
  }

  if (!esTexto(email) || email.trim().length === 0) {
    return responderHtml(
      res,
      400,
      "Error en el campo email",
      "El correo electrónico es obligatorio.",
      true
    );
  }

  const emailLimpio = email.trim();

  if (emailLimpio.length > LIMITES.email) {
    return responderHtml(
      res,
      400,
      "Error en el campo email",
      `El correo no puede superar los ${LIMITES.email} caracteres.`,
      true
    );
  }

  if (!esCorreoValido(emailLimpio)) {
    return responderHtml(
      res,
      400,
      "Error en el campo email",
      "Debes indicar un correo electrónico válido.",
      true
    );
  }

  if (!esTexto(message) || message.trim().length === 0) {
    return responderHtml(
      res,
      400,
      "Error en el campo message",
      "El mensaje es obligatorio.",
      true
    );
  }

  const messageLimpio = message.trim();

  if (messageLimpio.length > LIMITES.message) {
    return responderHtml(
      res,
      400,
      "Error en el campo message",
      `El mensaje no puede superar los ${LIMITES.message} caracteres.`,
      true
    );
  }

  const mensajeConfirmacion = `Gracias por contactar con nosotros <strong>${escaparHtml(nameLimpio)}</strong>. Tu comentario: <strong>${escaparHtml(messageLimpio)}</strong> ha sido anotado y nos pondremos en contacto contigo en el <strong>${escaparHtml(emailLimpio)}</strong> lo más pronto posible.`;

  return res
    .status(200)
    .type("html")
    .send(crearPagina("Mensaje recibido", mensajeConfirmacion));
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError || err.type === "entity.too.large") {
    return responderHtml(
      res,
      400,
      "Solicitud no válida",
      "No se han podido procesar los datos enviados.",
      true
    );
  }

  return next(err);
});

app.listen(PORT, () => {
  console.log(`Servicio disponible en el puerto ${PORT}`);
});

