const express = require('express')
const { engine } = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session');


const app = express()
const port = 80

// Configurar Handlebars con layout por defecto
app.engine('handlebars', engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.set('views', './views')
app.use(express.static('public'));

app.use(session({
  secret: 'clave_secreta_segura',  
  resave: false,
  saveUninitialized: false
}));


function authMiddleware(req, res, next) {
  if (req.session.usuario) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Leer datos de formularios
app.use(bodyParser.urlencoded({ extended: true }))

// "Base de datos" temporal
const usuarios = [
  { username: 'prueba', password: '1234', nombre: 'prueba', apellido: 'prueba', mail: 'prueba@prueba.cl' } // usuario de práctica
]

app.get('/', (req, res) => {
  res.redirect('/login')
})

// Registro
app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/register', (req, res) => {
  const { username, password, nombre, apellido, mail } = req.body
  const existe = usuarios.find(u => u.username === username)
  if (existe) return res.send('Usuario ya existe. <a href="/register">Volver</a>')
  console.log({username}, {password})
  usuarios.push({ username, password,nombre, apellido, mail})
  res.redirect('/login')
})

// Login
app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login', (req, res) => {
  const { username, password } = req.body
  const usuario = usuarios.find(u => u.username === username && u.password === password)
  if (!usuario) return res.send('Credenciales inválidas. <a href="/login">Intentar de nuevo</a>')
  req.session.usuario =  usuario;
  res.redirect(`/pp`);
})

app.get('/pp', authMiddleware, (req, res) => {
  res.render('pp', {
    script: '<script src="/js/tablero.js"></script>',
    username: req.session.usuario.username
  });
});

app.get('/partida',authMiddleware, (req, res)=>{
  res.render('partida',{
    script: '<script src="/js/tablero.js"></script>',
    username: req.session.usuario.username
  })
})

app.get('/desarrolladores', (req, res)=>{
  res.render('desarrolladores')
})

app.get('/perfil',authMiddleware ,(req, res)=>{
  const usuario = req.session.usuario;
  res.render('perfil',{
    username: usuario.username,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    mail: usuario.mail
  })
})

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.send('Error al cerrar sesión');
    }
    res.redirect('/login'); // o a '/' si prefieres
  });
});

app.get('/historia', (req, res)=>{
  res.render('historia')
})

app.listen(port, () => {
  console.log(`App corriendo en http://localhost:${port}`)
})