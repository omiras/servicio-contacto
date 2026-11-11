# Servicio de contacto — Huellas Felices

Servicio mínimo con Node.js y Express para recibir el formulario del supuesto práctico.

## Campos esperados

| Campo | Validación |
|---|---|
| `name` | Obligatorio, máximo 60 caracteres |
| `email` | Obligatorio, máximo 254 caracteres y formato de correo válido |
| `message` | Obligatorio, máximo 500 caracteres |

El formulario debe usar `method="post"` y enviar los datos a `/contacto`.

El servicio valida los campos en el orden `name`, `email` y `message`. Si encuentra un error, detiene la validación y devuelve un mensaje HTML destacado en la parte superior que identifica el primer campo incorrecto. Cuando los datos son válidos, devuelve el mensaje de confirmación con los datos enviados por el usuario en negrita.

## Ejecución local

1. Instala Node.js 20 o posterior.
2. Ejecuta `npm install`.
3. Ejecuta `npm start`.
4. Utiliza `http://localhost:3000/contacto` como valor de `action`.

El puerto se obtiene de `process.env.PORT`, como requiere Render, y utiliza el puerto 3000 en local.

## Publicación en Render

1. Sube únicamente esta carpeta a un repositorio de GitHub.
2. En Render, crea un servicio web conectado al repositorio.
3. Render puede leer `render.yaml` automáticamente.
4. Como alternativa, configura:
   - Build command: `npm install`
   - Start command: `npm start`
   - Health check: `/salud`
5. Sustituye en el ejercicio la URL local por:
   `https://NOMBRE-DEL-SERVICIO.onrender.com/contacto`

## Ejemplo de formulario

```html
<form action="http://localhost:3000/contacto" method="post">
  <input type="text" name="name" maxlength="60" required>
  <input type="email" name="email" maxlength="254" required>
  <textarea name="message" maxlength="500" required></textarea>
  <button type="submit">Enviar</button>
</form>
```

