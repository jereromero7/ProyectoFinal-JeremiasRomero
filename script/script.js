// DATOS NECESARIOS PARA CALCULAR
let precioDolarOficial = 0.00;
let precioDolar = 0.00;
let monedaSeleccionada = "USD";
let precioConvertido = 0.0;
let precio_inicial = 0.0;
let IVA = 0.21;
let PAIS = 0.08;
let GANANCIAS = 0.3;
let iibb = 0.0;

let precio_calculado = {
  precioIva: 0,
  precioPais: 0,
  precioGanancias: 0,
  precioIibb: 0,
  total: 0,
};

const PROVINCIAS = [
  {
    nombre: "CABA",
    impuesto: 0.02,
  },
  {
    nombre: "Buenos Aires",
    impuesto: 0.02,
  },
  {
    nombre: "Catamarca",
    impuesto: 0.0,
  },
  {
    nombre: "Chaco",
    impuesto: 0.055,
  },
  {
    nombre: "Chubut",
    impuesto: 0.0,
  },
  {
    nombre: "Corrientes",
    impuesto: 0.0,
  },
  {
    nombre: "Cordoba",
    impuesto: 0.03,
  },
  {
    nombre: "Entre Rios",
    impuesto: 0.0,
  },
  {
    nombre: "Formosa",
    impuesto: 0.0,
  },
  {
    nombre: "Jujuy",
    impuesto: 0.0,
  },
  {
    nombre: "La Pampa",
    impuesto: 0.01,
  },
  {
    nombre: "Catamarca",
    impuesto: 0.0,
  },
  {
    nombre: "La Rioja",
    impuesto: 0.0,
  },
  {
    nombre: "Mendoza",
    impuesto: 0.0,
  },
  {
    nombre: "Misiones",
    impuesto: 0.0,
  },
  {
    nombre: "Neuquen",
    impuesto: 0.04,
  },
  {
    nombre: "Rio Negro",
    impuesto: 0.05,
  },
  {
    nombre: "San Juan",
    impuesto: 0.0,
  },
  {
    nombre: "San Luis",
    impuesto: 0.0,
  },
  {
    nombre: "Salta",
    impuesto: 0.036,
  },
  {
    nombre: "Santa Cruz",
    impuesto: 0.0,
  },
  {
    nombre: "Santa Fe",
    impuesto: 0.0,
  },
  {
    nombre: "Sgo. del Estero",
    impuesto: 0.0,
  },
  {
    nombre: "T. del Fuego",
    impuesto: 0.03,
  },
  {
    nombre: "Tucuman",
    impuesto: 0.0,
  },
];

async function obtenerPrecioDolar() {
  try {
    const  respuesta = await fetch("https://dolarapi.com/v1/dolares/oficial");
    const data = await respuesta.json();

    precioDolarOficial = data.venta;
    precioDolar = precioDolarOficial * 1.10;

    calcularYRenderizar();
  } catch (error) {
    console.error("Error al obtener el precio del dólar:", error);
    alert("No se pudo obtener el precio del dólar. Inténtalo de nuevo más tarde.");
  }
}

function inicializarSelectProvincias() {
  const selectProvincias = document.getElementById("provincia");
  PROVINCIAS.forEach((provincia, index) => {
    const porcentaje = (provincia.impuesto * 100).toFixed(2);
    const option = document.createElement("option");
    option.value = provincia.impuesto;
    option.textContent = `${provincia.nombre} (${porcentaje}%)`;
    option.selected = index === 0;
    selectProvincias.appendChild(option);
  });

  iibb = parseFloat(PROVINCIAS[0].impuesto);

  selectProvincias.addEventListener("change", (evento) => {
    iibb = parseFloat(evento.target.value);
    calcularYRenderizar();
  });
}

function calcularYRenderizar() {
  let precioSinImpuesto;

  if (monedaSeleccionada === "USD") {
      precioSinImpuesto = precio_inicial * precioDolar;
  } else {
      precioSinImpuesto = precio_inicial;
  }

  const precios_calculado = calculadoraPesos(
      precioSinImpuesto,
      IVA,
      PAIS,
      GANANCIAS,
      iibb
  );

  renderizarResultados(
      precios_calculado.precioIva,
      precios_calculado.precioPais,
      precios_calculado.precioGanancias,
      precios_calculado.precioIibb,
      precioSinImpuesto,
      precios_calculado.total,
      precioDolarOficial,
      precioDolar
  );
}

function calculadoraPesos(precioInicial, iva, iPais, ganancias, iibb) {
  precioInicial = parseFloat(precioInicial);
  return {
    precioIva: precioInicial * iva,
    precioPais: precioInicial * iPais,
    precioGanancias: precioInicial * ganancias,
    precioIibb: precioInicial * iibb,
    get total() {
      return (
        this.precioIva +
        this.precioPais +
        this.precioGanancias +
        this.precioIibb +
        precioInicial
      );
    },
  };
}

function formatearPesos(valor) {
  if (typeof valor !== 'number') {
    return 'No válido';
  }

  const partes = valor.toFixed(2).split('.');
  const parteEntera = partes[0];
  let parteDecimal = partes[1];
  
  if (parteDecimal.length < 2) {
    parteDecimal += '0';
  }

  const parteEnteraFormateada = parteEntera.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return `AR$ ${parteEnteraFormateada}.${parteDecimal}`;
}

function renderizarResultados(
  rIva,
  rPais,
  rGanancias,
  rProvincia,
  rSinImpuesto,
  rTotal,
  rPrecioDolarOficial,
  rPrecioDolar
) {
  document.getElementById("resultado-iva").innerText = formatearPesos(rIva);
  document.getElementById("resultado-pais").innerText = formatearPesos(rPais);
  document.getElementById("resultado-ganancias").innerText = formatearPesos(rGanancias);
  document.getElementById("resultado-provincia").innerText = formatearPesos(rProvincia);
  document.getElementById("resultado-sin-impuesto").innerText = formatearPesos(rSinImpuesto);
  document.getElementById("resultado-total").innerText = formatearPesos(rTotal);
  document.getElementById("precio-dolar-oficial").innerText = formatearPesos(rPrecioDolarOficial);
  document.getElementById("precio-dolar").innerText = formatearPesos(rPrecioDolar);
}

document.getElementById("input-calculadora").addEventListener("input", (evento) => {
    precio_inicial = parseFloat(evento.target.value) || 0.0;

    if (monedaSeleccionada === "USD") {
        precioConvertido = precio_inicial * precioDolar;
    }
    calcularYRenderizar();
  });

let selectorArs = document.getElementById("selector-ars");
let selectorUsd = document.getElementById("selector-usd");

if (monedaSeleccionada === "ARS") {
    selectorArs.classList.toggle("moneda-seleccionada");
} else {
    selectorUsd.classList.toggle("moneda-seleccionada");
}

selectorArs.addEventListener("click", ()=>{
    selectorArs.classList.add("moneda-seleccionada");
    selectorUsd.classList.remove("moneda-seleccionada");
    monedaSeleccionada = "ARS";
    calcularYRenderizar();
})

selectorUsd.addEventListener("click", ()=>{
    selectorUsd.classList.add("moneda-seleccionada");
    selectorArs.classList.remove("moneda-seleccionada");
    monedaSeleccionada = "USD";
    calcularYRenderizar();
})

obtenerPrecioDolar()
inicializarSelectProvincias();
calcularYRenderizar();



