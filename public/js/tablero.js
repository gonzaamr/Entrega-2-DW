const p = [
  { icono: "♜", fila: 0, col: 0, color: "blanca" }, { icono: "♞", fila: 0, col: 1, color: "blanca" },
  { icono: "♝", fila: 0, col: 2, color: "blanca" }, { icono: "♛", fila: 0, col: 3, color: "blanca" },
  { icono: "♚", fila: 0, col: 4, color: "blanca" }, { icono: "♝", fila: 0, col: 5, color: "blanca" },
  { icono: "♞", fila: 0, col: 6, color: "blanca" }, { icono: "♜", fila: 0, col: 7, color: "blanca" },
  { icono: "♟", fila: 1, col: 0, color: "blanca" }, { icono: "♟", fila: 1, col: 1, color: "blanca" },
  { icono: "♟", fila: 1, col: 2, color: "blanca" }, { icono: "♟", fila: 1, col: 3, color: "blanca" },
  { icono: "♟", fila: 1, col: 4, color: "blanca" }, { icono: "♟", fila: 1, col: 5, color: "blanca" },
  { icono: "♟", fila: 1, col: 6, color: "blanca" }, { icono: "♟", fila: 1, col: 7, color: "blanca" },

  { icono: "♜", fila: 7, col: 0, color: "negra" }, { icono: "♞", fila: 7, col: 1, color: "negra" },
  { icono: "♝", fila: 7, col: 2, color: "negra" }, { icono: "♛", fila: 7, col: 3, color: "negra" },
  { icono: "♚", fila: 7, col: 4, color: "negra" }, { icono: "♝", fila: 7, col: 5, color: "negra" },
  { icono: "♞", fila: 7, col: 6, color: "negra" }, { icono: "♜", fila: 7, col: 7, color: "negra" },
  { icono: "♟", fila: 6, col: 0, color: "negra" }, { icono: "♟", fila: 6, col: 1, color: "negra" },
  { icono: "♟", fila: 6, col: 2, color: "negra" }, { icono: "♟", fila: 6, col: 3, color: "negra" },
  { icono: "♟", fila: 6, col: 4, color: "negra" }, { icono: "♟", fila: 6, col: 5, color: "negra" },
  { icono: "♟", fila: 6, col: 6, color: "negra" }, { icono: "♟", fila: 6, col: 7, color: "negra" }
];

const piezasIniciales = p;
const m = [];
const movimientos = m;


const tablero = document.getElementById("tablero");

// Cargar estado guardado desde localStorage
const estadoGuardado = localStorage.getItem("estadoAjedrez");
const piezasDesdeLocalStorage = estadoGuardado ? JSON.parse(estadoGuardado) : piezasIniciales;

const estadoMovimientos = localStorage.getItem("estadoMovimientos");
movimientos.push(...(estadoMovimientos ? JSON.parse(estadoMovimientos) : []));





function guardar() {
  const piezas = [];
  const casillas = document.querySelectorAll(".casilla");
  casillas.forEach(casilla => {
    const pieza = casilla.querySelector(".pieza");
    if (pieza) {
      const color = getComputedStyle(pieza).color;
      const tipo = color === 'rgb(255, 255, 255)' ? 'blanca' : 'negra';
      const [_, fila, col] = casilla.id.split("-");
      piezas.push({
        icono: pieza.textContent,
        fila: parseInt(fila),
        col: parseInt(col),
        color: tipo
      });
    }
  });
  localStorage.setItem("estadoAjedrez", JSON.stringify(piezas));
}

const move1 = document.getElementById("m1");
const move2 = document.getElementById("m2");


function agregarMovimientoAlHistorial(mov) { //funcion para registrar movimieentos
  const li = document.createElement("li");
  li.textContent = `${mov.origen} → ${mov.destino}`;
  if(mov.color === "blanca"){
    move1.insertBefore(li, move1.firstChild);
    li.style.color = "white";
    li.style.background=" rgba(0, 0, 0, 0.6)";
  }
  else{
    move2.insertBefore(li, move2.firstChild);
    li.style.color = "black";
    li.style.background="rgba(255, 255, 255, 0.6)";
  };
};

function turno() {
  if (movimientos.length === 0) return "blanca"; // Primer turno
  const ultimo = movimientos.at(-1);
  return ultimo.color === "blanca" ? "negra" : "blanca";
}

function actualizarTurnoVisual() {
  const turnoActual = turno();
  const playerSpan = document.querySelector(".player");
  const cuadroBlancas = document.querySelector(".c1");
  const cuadroNegras = document.querySelector(".c2");

  playerSpan.textContent = turnoActual;

  if (turnoActual === "blanca") {
    cuadroBlancas.classList.add("activo");
    cuadroNegras.classList.remove("activo");
  } else {
    cuadroBlancas.classList.remove("activo");
    cuadroNegras.classList.add("activo");
  }
}

// Crear las casillas y las piezas
for (let fila = 0; fila < 8; fila++) {
  for (let col = 0; col < 8; col++) {
    const casilla = document.createElement("div");
    casilla.classList.add("casilla");
    casilla.classList.add((fila + col) % 2 === 0 ? "claro" : "oscuro");
    casilla.id = `casilla-${fila}-${col}`;

    casilla.addEventListener("dragover", e => {
  e.preventDefault();
      casilla.style.transform = "scale(1.2)";
    });

    casilla.addEventListener("dragleave", () => {
      casilla.style.transform = "scale(1)";
    });

    casilla.addEventListener("drop", e => {
      e.preventDefault();
      const piezaId = e.dataTransfer.getData("text/plain");
      const casillaOrigenId = e.dataTransfer.getData("origen");
      const casillaDestinoId = e.currentTarget.id;
      const pieza = document.getElementById(piezaId);
      const colorCSS = getComputedStyle(pieza).color;
      const colorPieza = colorCSS === 'rgb(255, 255, 255)' ? 'blanca' : 'negra';

      const turnoActual = turno();
      if (colorPieza !== turnoActual) {
        alert(`¡Es turno de las ${turnoActual}s!`);
        casilla.style.transform = "scale(1)";
        return; 
      }
      
      
      if (e.currentTarget.children.length === 0) {
        e.currentTarget.appendChild(pieza);
        const [_, filaOrigen, colOrigen] = casillaOrigenId.split("-");
        const [__, filaDestino, colDestino] = casillaDestinoId.split("-");
        if (casillaOrigenId !== casillaDestinoId) {
          const mov = {
            origen: `${parseInt(filaOrigen)}-${parseInt(colOrigen)}`,
            destino: `${parseInt(filaDestino)}-${parseInt(colDestino)}`,
            color: colorPieza
          };

          movimientos.push(mov);
          localStorage.setItem("estadoMovimientos", JSON.stringify(movimientos));

          agregarMovimientoAlHistorial(mov);
          
          const turnoDe = document.querySelector(".player");
          const nombre = turnoActual === 'blanca' ?  'negra': 'blanca';
          turnoDe.textContent = nombre;
          actualizarTurnoVisual();


    
          console.log(movimientos);
        }
        guardar();

      } else {
        console.log("Ya hay una pieza aquí");
      }
      casilla.style.transform = "scale(1)";
    });

    const piezaData = piezasDesdeLocalStorage.find(p => p.fila === fila && p.col === col);

    if (piezaData) {
      const pieza = document.createElement("div");
      pieza.textContent = piezaData.icono;
      pieza.classList.add("pieza");
      pieza.setAttribute("draggable", "true");
      pieza.id = `pieza-${fila}-${col}`;
      pieza.style.color = piezaData.color === "blanca" ? "white" : "black";

      pieza.addEventListener("dragstart", e => {
        e.dataTransfer.setData("text/plain", e.target.id);
        e.dataTransfer.setData("origen", e.target.parentElement.id);
      });

      casilla.appendChild(pieza);
    }

    tablero.appendChild(casilla);
  }
}

movimientos.forEach(agregarMovimientoAlHistorial);
actualizarTurnoVisual(); // ← Aquí
// 




const rendirse = document.getElementById("rendirse")

rendirse.addEventListener("click", () => {
  const seguro = confirm("¿Estás segur@ de querer rendirte?");
  
  if (seguro) {
    const jugador = turno(); 
    if (jugador === "negra") {
      alert("Ganador: Piezas blancas");
    } else {
      alert("Ganador: Piezas negras");
    }
    localStorage.removeItem("estadoAjedrez");
    localStorage.removeItem("estadoMovimientos");
    location.href = "/pp";
  }
});


const empatar = document.getElementById("empatar")
empatar.addEventListener("click", () => {
  const seguro = confirm("¿Están seguros de querer empatar?");
  if (seguro) {
    alert("Empate");
    localStorage.removeItem("estadoAjedrez");
    localStorage.removeItem("estadoMovimientos");
    location.href = "/pp";


  }
});

