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

app.get("/", (req, res) => {
  res.type("text/plain").send("Servicio de contacto de Huellas Felices");
});

app.get("/salud", (req, res) => {
  res.json({ estado: "ok" });
});

app.post("/contacto", (req, res) => {
  const { nombre, correo, comentario } = req.body;

  if (!esTexto(nombre) || !esTexto(correo) || !esTexto(comentario)) {
    return res.status(400).type("text/plain").send(
      "Los campos nombre, correo y comentario son obligatorios."
    );
  }

  const nombreLimpio = nombre.trim();
  const correoLimpio = correo.trim();
  const comentarioLimpio = comentario.trim();

  if (nombreLimpio.length === 0 || nombreLimpio.length > LIMITES.nombre) {
    return res.status(400).type("text/plain").send(
      `El nombre debe tener entre 1 y ${LIMITES.nombre} caracteres.`
    );
  }

  if (
    correoLimpio.length === 0 ||
    correoLimpio.length > LIMITES.correo ||
    !esCorreoValido(correoLimpio)
  ) {
    return res.status(400).type("text/plain").send(
      "Debes indicar un correo electrónico válido."
    );
  }

  if (
    comentarioLimpio.length === 0 ||
    comentarioLimpio.length > LIMITES.comentario
  ) {
    return res.status(400).type("text/plain").send(
      `El comentario debe tener entre 1 y ${LIMITES.comentario} caracteres.`
    );
  }

  return res.type("text/plain").send(
    `Gracias por contactar con nosotros ${nombreLimpio}. Tu comentario: ${comentarioLimpio} ha sido anotado y nos pondremos en contacto contigo en el ${correoLimpio} lo más pronto posible.`
  );
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError || err.type === "entity.too.large") {
    return res.status(400).type("text/plain").send("La solicitud no es válida.");
  }

  return next(err);
});

app.listen(PORT, () => {
  console.log(`Servicio disponible en el puerto ${PORT}`);
});

