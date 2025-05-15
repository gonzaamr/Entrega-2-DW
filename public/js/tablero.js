const piezasIniciales = [
    { icono: "♜", fila: 0, col: 0 }, { icono: "♞", fila: 0, col: 1 },
    { icono: "♝", fila: 0, col: 2 }, { icono: "♛", fila: 0, col: 3 },
    { icono: "♚", fila: 0, col: 4 }, { icono: "♝", fila: 0, col: 5 },
    { icono: "♞", fila: 0, col: 6 }, { icono: "♜", fila: 0, col: 7 },
    { icono: "♟", fila: 1, col: 0 }, { icono: "♟", fila: 1, col: 1 },
    { icono: "♟", fila: 1, col: 2 }, { icono: "♟", fila: 1, col: 3 },
    { icono: "♟", fila: 1, col: 4 }, { icono: "♟", fila: 1, col: 5 },
    { icono: "♟", fila: 1, col: 6 }, { icono: "♟", fila: 1, col: 7 },

    { icono: "♜", fila: 7, col: 0 }, { icono: "♞", fila: 7, col: 1 },
    { icono: "♝", fila: 7, col: 2 }, { icono: "♛", fila: 7, col: 3 },
    { icono: "♚", fila: 7, col: 4 }, { icono: "♝", fila: 7, col: 5 },
    { icono: "♞", fila: 7, col: 6 }, { icono: "♜", fila: 7, col: 7 },
    { icono: "♟", fila: 6, col: 0 }, { icono: "♟", fila: 6, col: 1 },
    { icono: "♟", fila: 6, col: 2 }, { icono: "♟", fila: 6, col: 3 },
    { icono: "♟", fila: 6, col: 4 }, { icono: "♟", fila: 6, col: 5 },
    { icono: "♟", fila: 6, col: 6 }, { icono: "♟", fila: 6, col: 7 }
  ];

  const tablero = document.getElementById("tablero");

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
        console.log(piezaId);
        const pieza = document.getElementById(piezaId); //Crea una variable con el objeto segun su id
        e.currentTarget.children.length === 0 ? e.currentTarget.appendChild(pieza) : console.log('Ya hay una pieza aqui'); //Verififca que no haya anda en el objetivo yy si no hay deja la pieza ahi
        casilla.style.transform = "scale(1)";
      });
      //<div class="casilla claro/oscuro" id="casilla-fila-col"></div>
      var piezaData = piezasIniciales.find(p => p.fila === fila && p.col === col);


      if (piezaData) {
        var pieza = document.createElement("div");
        pieza.textContent = piezaData.icono;
        pieza.classList.add("pieza");
        pieza.setAttribute("draggable", "true");
        pieza.id = `pieza-${fila}-${col}`;
        if (fila === 0 || fila ===1) {
          pieza.style.color = "white"; 
        }
        else{
          pieza.style.color = "black";
        }
        pieza.addEventListener("dragstart", e => {
          e.dataTransfer.setData("text/plain", e.target.id);
        }); 
          casilla.appendChild(pieza);
      }
      tablero.appendChild(casilla);
    }
  }