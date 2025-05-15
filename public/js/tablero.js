const p = [
    { icono: "♜", fila: 0, col: 0, color: "blanca" }, { icono: "♞", fila: 0, col: 1, color: "blanca" },
    { icono: "♝", fila: 0, col: 2, color: "blanca" }, { icono: "♛", fila: 0, col: 3, color: "blanca" },
    { icono: "♚", fila: 0, col: 4, color: "blanca" }, { icono: "♝", fila: 0, col: 5, color: "blanca" },
    { icono: "♞", fila: 0, col: 6, color: "blanca" }, { icono: "♜", fila: 0, col: 7, color: "blanca" },
    { icono: "♟", fila: 1, col: 0, color: "blanca" }, { icono: "♟", fila: 1, col: 1, color: "blanca" },
    { icono: "♟", fila: 1, col: 2, color: "blanca" }, { icono: "♟", fila: 1, col: 3, color: "blanca" },
    { icono: "♟", fila: 1, col: 4, color: "blanca" }, { icono: "♟", fila: 1, col: 5, color: "blanca" },
    { icono: "♟", fila: 1, col: 6, color: "blanca" }, { icono: "♟", fila: 1, col: 7, color: "blanca" },

    { icono: "♜", fila: 7, col: 0, color: "negra" }, { icono: "♞", fila: 7, col: 1, color: "negra"  },
    { icono: "♝", fila: 7, col: 2, color: "negra" }, { icono: "♛", fila: 7, col: 3, color: "negra"  },
    { icono: "♚", fila: 7, col: 4, color: "negra"  }, { icono: "♝", fila: 7, col: 5, color: "negra" },
    { icono: "♞", fila: 7, col: 6, color: "negra"  }, { icono: "♜", fila: 7, col: 7, color: "negra"  },
    { icono: "♟", fila: 6, col: 0, color: "negra"  }, { icono: "♟", fila: 6, col: 1, color: "negra"  },
    { icono: "♟", fila: 6, col: 2, color: "negra"  }, { icono: "♟", fila: 6, col: 3, color: "negra"  },
    { icono: "♟", fila: 6, col: 4, color: "negra"  }, { icono: "♟", fila: 6, col: 5, color: "negra"  },
    { icono: "♟", fila: 6, col: 6, color: "negra"  }, { icono: "♟", fila: 6, col: 7, color: "negra"  }
  ];

  const piezasIniciales = p;
  const movimientos = [];
  const tablero = document.getElementById("tablero");

  function guardar() {
  const piezas = [];
  const casillas = document.querySelectorAll(".casilla");

  casillas.forEach(casilla => {
    const pieza = casilla.querySelector(".pieza");
    if (pieza) {  
      const color = getComputedStyle(pieza).color;
      const tipo = color === 'rgb(255, 255, 255)' ? 'blanca':'negra';
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



  for (let fila = 0; fila < 8; fila++) { //Para recorrer filas 
    for (let col = 0; col < 8; col++) {  //Para recorrer columnas

      const casilla = document.createElement("div");  //Crea un div en el DOM(HTML)
      casilla.classList.add("casilla"); // Al div le añade class="casilla"
      casilla.classList.add((fila + col) % 2 === 0 ? "claro" : "oscuro"); //Si el modulo en 2 de fila+col es 0 la clase del div conteniido en casilla será class="casilla claro"
      casilla.id = `casilla-${fila}-${col}`; //Crea un id="casilla-fil-col" al DOM contenido en casilla
      // <div class="casilla claro/oscuro" id="casilla-fila-col"></div>

      casilla.addEventListener("dragover", e => {
        e.preventDefault();
        casilla.style.transform="scale(1.2)";
      }); // Se agrega una evento escuchador a casilla, que si suscede un dragvoer, se ejecuta la funcion con parametro e, la cual es e.preventdefault(). la cual dice 'no actues como lo haces normalmente' al DOM

      casilla.addEventListener("dragleave", () => {
        casilla.style.transform = "scale(1)";
      });

      casilla.addEventListener("drop", e => { //Añade un escuchador de eventoos a casilla para drops
        e.preventDefault(); //Le dice al objeto que no actue segun default
        const piezaId = e.dataTransfer.getData("text/plain"); //Crea una variable y le almacena el id del objeto arrastrado
        const casillaOrigenId = e.dataTransfer.getData("origen");
        console.log(piezaId);
        const pieza = document.getElementById(piezaId); //Crea una variable con el objeto segun su id
        e.currentTarget.children.length === 0 ? e.currentTarget.appendChild(pieza) : console.log('Ya hay una pieza aqui'); //Verififca que no haya anda en el objetivo yy si no hay deja la pieza ahi
        const casillaDestinoId = e.currentTarget.id;
        const [_, filaOrigen, colOrigen] = casillaOrigenId.split("-");
        const [__, filaDestino, colDestino] = casillaDestinoId.split("-");
        movimientos.push({
          origen: `${parseInt(filaOrigen)}-${parseInt(colOrigen)}`,
          destino: `${parseInt(filaDestino)}-${parseInt(colDestino)}`
        });
        console.log(movimientos);
        casilla.style.transform = "scale(1)";
        guardar();
      });

      const estadoGuardado = localStorage.getItem("estadoAjedrez");
      const piezasIniciales = estadoGuardado ? JSON.parse(estadoGuardado) : p;

  
      //<div class="casilla claro/oscuro" id="casilla-fila-col"></div>
      var piezaData = piezasIniciales.find(p => p.fila === fila && p.col === col); //Busca en el  arreglo piezasIniciales cierta pieza de una fila y columna 

      if (piezaData) { //Si es que hay una pieza en esa fila y columna
        var pieza = document.createElement("div"); //Crea un div
        pieza.textContent = piezaData.icono; //Hace que el atributo icono de piezaData sea el contenido visible del dom almacenado en pieza
        pieza.classList.add("pieza");//Le agrega una clase al DOM
        pieza.setAttribute("draggable", "true");//Convierte el elemento HTML en uno arrastrable
        pieza.id = `pieza-${fila}-${col}`; //Define el id del dom
        
        piezaData.color === "blanca" ? pieza.style.color = "white" : pieza.style.color = "black";//Define el color de la pieza
    
        pieza.addEventListener("dragstart", e => { //Agrega un evento de escucha a la una pieza cuando empieza el arrastre
          e.dataTransfer.setData("text/plain", e.target.id);// Define los datos de los objetos(La pieza que fue objetivo del dragstart) que gatillaron el evento, en texto plano
          e.dataTransfer.setData("origen", e.target.parentElement.id);
        }); 
          casilla.appendChild(pieza);//Coloca la pieza en la casilla
      }
      tablero.appendChild(casilla);//Coloca la casilla en el tablero
    }
  }