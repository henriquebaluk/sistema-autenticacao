const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

// Configurações do middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: 'segredo',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, 
  })
);

// Variável para simular usuário autenticado
const usuarioSimulado = { username: 'admin', password: '1234' };

// Middleware de autenticação
function autenticarUsuario(req, res, next) {
  if (req.session.autenticado) {
    return next();
  }
  res.status(401).send('Acesso negado: você precisa fazer login.');
}

// Rota de login
app.get('/login', (req, res) => {
  const { username, password } = req.query; 
  if (username === usuarioSimulado.username && password === usuarioSimulado.password) {
    req.session.autenticado = true;
    res.send('Login bem-sucedido!');
  } else {
    res.status(401).send('Credenciais inválidas');
  }
});


// Rota de logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.send('Logout realizado com sucesso!');
});

// Rota protegida
app.get('/protegido', autenticarUsuario, (req, res) => {
  res.send('Bem-vindo à página protegida!');
});

// Rota principal
app.get('/', (req, res) => {
  res.send('Bem-vindo! Faça login para acessar a página protegida.');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
