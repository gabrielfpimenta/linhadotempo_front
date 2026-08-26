import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração para resolver o __dirname no formato ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializa a aplicação Express
const app = express();

// Configura a pasta de arquivos estáticos (HTML, CSS, JS do front-end)
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicializa o servidor na porta 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso em http://localhost:${PORT}`);
});