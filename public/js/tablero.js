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


      if (e.currentTarget.children.length === 0) {
        e.currentTarget.appendChild(pieza);
        const [_, filaOrigen, colOrigen] = casillaOrigenId.split("-");
        const [__, filaDestino, colDestino] = casillaDestinoId.split("-");
        if (casillaOrigenId !== casillaDestinoId) {
          const mov = {
            origen: `${parseInt(filaOrigen)}-${parseInt(colOrigen)}`,
            destino: `${parseInt(filaDestino)}-${parseInt(colDestino)}`,
            color: colorCSS === 'rgb(255, 255, 255)' ? 'blanca' : 'negra'
          };

          movimientos.push(mov);
          localStorage.setItem("estadoMovimientos", JSON.stringify(movimientos));

          const nuevoMovimiento = document.createElement("li");
          nuevoMovimiento.textContent = `${mov.origen} → ${mov.destino}`;
          nuevoMovimiento.style.color = mov.color === "blanca" ? "white" : "black";
          move.appendChild(nuevoMovimiento);

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

const move = document.getElementById("m")

movimientos.forEach(mov =>{
  const a = document.createElement("li");
  a.textContent = `${mov.origen} → ${mov.destino}`;
  move.appendChild(a);
});

