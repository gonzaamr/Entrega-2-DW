const express = require('express')
const { engine } = require('express-handlebars')
const bodyParser = require('body-parser')

const app = express()
const port = 80

// Configurar Handlebars con layout por defecto
app.engine('handlebars', engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.set('views', './views')
app.use(express.static('public'));


// Leer datos de formularios
app.use(bodyParser.urlencoded({ extended: true }))

// "Base de datos" temporal
const usuarios = [
  { username: 'prueba', password: '1234' } // usuario de práctica
]

// Registro
app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/register', (req, res) => {
  const { username, password } = req.body
  const existe = usuarios.find(u => u.username === username)
  if (existe) return res.send('Usuario ya existe. <a href="/register">Volver</a>')
  console.log({username}, {password})
  usuarios.push({ username, password })
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
  res.redirect(`/pp?username=${encodeURIComponent(username)}`);
})

app.get('/pp', (req, res) => {
  res.render('pp',{
    script: '<script src="/js/tablero.js"></script>'
  })
})

// Ruta raíz
app.get('/', (req, res) => {
  res.redirect('/login')
})

app.get('/partida', (req, res)=>{
  res.render('partida',{
  script: '<script src="/js/tablero.js"></script>'
  })
})

app.listen(port, () => {
  console.log(`App corriendo en http://localhost:${port}`)
})