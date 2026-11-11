"use strict";

const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

const LIMITES = {
  nombre: 60,
  correo: 254,
  comentario: 500
};

app.use(express.urlencoded({ extended: false, limit: "10kb" }));
app.use(express.json({ limit: "10kb" }));

function esTexto(valor) {
  return typeof valor === "string";
}

function esCorreoValido(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

function escaparHtml(texto) {
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function crearPagina(titulo, mensaje, esError = false) {
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
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 24px;
      color: #27332f;
      background-color: #f7f3ec;
      font-family: Arial, Verdana, sans-serif;
    }
    main {
      width: 100%;
      max-width: 760px;
      padding: 36px;
      background-color: #ffffff;
      border: 2px solid ${color};
      border-radius: 12px;
      text-align: center;
    }
    h1 {
      margin-top: 0;
      color: ${color};
      font-size: 2rem;
    }
    p {
      margin-bottom: 0;
      font-size: 1.3rem;
    }
  </style>
</head>
<body>
  <main>
    <h1>${escaparHtml(titulo)}</h1>
    <p>${escaparHtml(mensaje)}</p>
  </main>
</body>
</html>`;
}

function responderHtml(res, estado, titulo, mensaje, esError = false) {
  return res
    .status(estado)
    .type("html")
    .send(crearPagina(titulo, mensaje, esError));
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
  const { nombre, correo, comentario } = req.body;

  if (!esTexto(nombre) || nombre.trim().length === 0) {
    return responderHtml(
      res,
      400,
      "Error en el campo nombre",
      "El nombre es obligatorio.",
      true
    );
  }

  const nombreLimpio = nombre.trim();

  if (nombreLimpio.length > LIMITES.nombre) {
    return responderHtml(
      res,
      400,
      "Error en el campo nombre",
      `El nombre no puede superar los ${LIMITES.nombre} caracteres.`,
      true
    );
  }

  if (!esTexto(correo) || correo.trim().length === 0) {
    return responderHtml(
      res,
      400,
      "Error en el campo correo",
      "El correo electrónico es obligatorio.",
      true
    );
  }

  const correoLimpio = correo.trim();

  if (correoLimpio.length > LIMITES.correo) {
    return responderHtml(
      res,
      400,
      "Error en el campo correo",
      `El correo no puede superar los ${LIMITES.correo} caracteres.`,
      true
    );
  }

  if (!esCorreoValido(correoLimpio)) {
    return responderHtml(
      res,
      400,
      "Error en el campo correo",
      "Debes indicar un correo electrónico válido.",
      true
    );
  }

  if (!esTexto(comentario) || comentario.trim().length === 0) {
    return responderHtml(
      res,
      400,
      "Error en el campo comentario",
      "El comentario es obligatorio.",
      true
    );
  }

  const comentarioLimpio = comentario.trim();

  if (comentarioLimpio.length > LIMITES.comentario) {
    return responderHtml(
      res,
      400,
      "Error en el campo comentario",
      `El comentario no puede superar los ${LIMITES.comentario} caracteres.`,
      true
    );
  }

  return responderHtml(
    res,
    200,
    "Mensaje recibido",
    `Gracias por contactar con nosotros ${nombreLimpio}. Tu comentario: ${comentarioLimpio} ha sido anotado y nos pondremos en contacto contigo en el ${correoLimpio} lo más pronto posible.`
  );
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

