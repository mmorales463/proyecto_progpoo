const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.post('/save', (req, res) => {
  const data = req.body;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `formulario_${data.tipo || 'datos'}_${timestamp}.txt`;
  const filePath = path.join(__dirname, 'data', filename);
  const jsonPath = path.join(__dirname, 'data', 'formulario_general.json');
  const content = JSON.stringify(data, null, 2);

  fs.mkdir(path.join(__dirname, 'data'), { recursive: true }, (err) => {
    if (err) return res.status(500).json({ mensaje: 'Error creando carpeta' });

    fs.writeFileSync(filePath, content);

    let existing = [];
    try {
      if (fs.existsSync(jsonPath)) {
        const raw = fs.readFileSync(jsonPath, 'utf-8').trim();
        if (raw) existing = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Error leyendo JSON existente:', e.message);
    }

    existing.push(data);
    fs.writeFileSync(jsonPath, JSON.stringify(existing, null, 2));

    res.status(200).json({ mensaje: 'Datos guardados correctamente' });
  });
});

app.get('/usuarios', (req, res) => {
  const jsonPath = path.join(__dirname, 'data', 'formulario_general.json');

  console.log("GET /usuarios llamado");

  try {
    if (!fs.existsSync(jsonPath)) {
      console.warn("formulario_general.json no existe.");
      return res.status(404).json({ mensaje: 'Archivo de usuarios no encontrado' });
    }

    const raw = fs.readFileSync(jsonPath, 'utf-8').trim();
    const data = raw ? JSON.parse(raw) : [];

    return res.json(data);
  } catch (e) {
    console.error("Error al leer usuarios:", e.message);
    return res.status(500).json({ mensaje: 'Error leyendo usuarios', error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
