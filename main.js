let config = null;

let saldoActual = 50000;
let cotizacion = 1460;
let tasaPF = 30;
let USUARIO_OK = 1234;
let CLAVE_OK = 8888;

async function cargarConfig() {
  try {
    const resp = await fetch("./data.json");
    if (!resp.ok) throw new Error("No se pudo cargar data.json");
    config = await resp.json();

 
    saldoActual = Number(config.saldoInicial);
    cotizacion = Number(config.cotizacionDolar);
    tasaPF = Number(config.tasaPlazoFijo);
    USUARIO_OK = Number(config.usuario);
    CLAVE_OK = Number(config.clave);

    consultarSaldo(); // refresca el saldo en pantalla si querés
  } catch (err) {
    console.warn("Usando valores por defecto:", err);
  }
}

document.addEventListener("DOMContentLoaded", cargarConfig);



let intentos=3;

let botonIngresar =document.getElementById("ingreso");
botonIngresar.addEventListener("click",validarLogin);

function validarLogin(){
     
        let usuario=Number(document.getElementById("usuarioProvisorio").value);
        let clave=Number(document.getElementById("claveProvisoria").value);
        if (usuario === USUARIO_OK && clave === CLAVE_OK){
            document.getElementById("validacionLogin").textContent=`Bienvenido ya podes comenzar a operar con tu Home Banking`;

            document.getElementById("login").style.display="none";
            document.getElementById("homebanking").style.display="block";
            return;
        }intentos--;
        if (intentos>0){
            document.getElementById("validacionLogin").textContent=`Usuario o clave incorrectos .Te quedan ${intentos}intentos`;
        
        }else{document.getElementById("validacionLogin").textContent=`Usuario bloqueado,comunicate con el Banco`;
            botonIngresar.disabled=true;
        
        }

    }

let fecha=new Date();

document.getElementById("fechaActual").textContent=`Fecha:${fecha.toLocaleDateString()}`;

let movimientos= [];
let saldoElemento=document.getElementById("saldo");

let botonConsultarSaldo=document.getElementById("consultarSaldo");
botonConsultarSaldo.addEventListener("click",consultarSaldo);

function consultarSaldo(){
    saldoElemento.textContent=`El saldo actual es ${saldoActual}`;
}

consultarSaldo();


let botonTransferir = document.getElementById("botonTransferir");
let btnConfirmarTransferencia=document.getElementById("btnConfirmartransferencia");
btnConfirmarTransferencia.addEventListener("click",transferir)

function transferir(){
    let destino=document.getElementById("destinatario").value;
    let montoIngresado=Number(document.getElementById("montoTransferencia").value);

    if(destino===""){
        document.getElementById("validacionMontoT").textContent="Ingrese CBU/CVU/ALIAS";
        return;
    }

    if(montoIngresado<=0){
        document.getElementById("validacionMontoT").textContent="Ingrese un monto valido";
        return;
    }
    if (montoIngresado>saldoActual){
    document.getElementById("validacionMontoT").textContent="El saldo es insuficiente"
} else  { saldoActual=saldoActual-montoIngresado;
    consultarSaldo();
     document.getElementById("validacionMontoT").textContent=`Se ha transferido a al destinatario ${destino} la suma de $ ${montoIngresado.toFixed(2)} exitosamente`;
    movimientos.push({
    tipo: "Transferencia",
    monto: montoIngresado,
    fecha: new Date().toLocaleDateString(),
}); 
    mostrarHistorial();
}} 



let botonPrestamo=document.getElementById("botonPrestamo");
let botonConfirmarPrestamo=document.getElementById("btnconfirmarPrestamo");
botonConfirmarPrestamo.addEventListener("click",sacarPrestamo);


function sacarPrestamo(){
    let montoPreaprobado=5000000;
    let montoSolicitado=Number(document.getElementById("montoPrestamo").value);

    if(montoPreaprobado<montoSolicitado){
        document.getElementById("validacionPrestamo").textContent="Ingrese un importe menor"
    } else {saldoActual=saldoActual + montoSolicitado;
        consultarSaldo();
        document.getElementById("validacionPrestamo").textContent=`El préstamo ha sido acreditado en su cuenta por el importe de ${montoSolicitado} con TNA 30% pagadero 24 cuotas mensuales`;
    }
    movimientos.push({
    tipo: "Prestamo",
    monto: montoSolicitado,
    fecha: new Date().toLocaleDateString(),
}); 
    mostrarHistorial();
}


let botonDolares=document.getElementById("botonDolares");
let botonConfirmarCompra=document.getElementById("btnConfirmarCompra");
botonConfirmarCompra.addEventListener("click",comprarDolares);

function comprarDolares(){
    let montoPesos=Number(document.getElementById("montoPesos").value);
    let conversion= Math.floor(montoPesos/cotizacion);

    if(montoPesos<=0){
        document.getElementById("validacionDolares").textContent=`Ingrese un monto valido`;
        return;
    }   

    if (montoPesos>saldoActual){
        document.getElementById("validacionDolares").textContent=`Su saldo es insuficiente`
    } else {saldoActual= saldoActual-montoPesos;
        consultarSaldo();
        document.getElementById("validacionDolares").textContent=`Usted ha comprado la cantidad de ${conversion.toFixed(2)} dólares equivalentes a $ ${montoPesos.toFixed(2)} `;

    }
    movimientos.push({
    tipo: "Compra de dólares",
    monto: `${conversion} USD`,
    fecha: new Date().toLocaleDateString(),
}); 
    mostrarHistorial();
}
let botonPlazoFijo=document.getElementById("botonPlazoFijo");
let botonConfirmarPlazoFijo=document.getElementById("btnconfirmarplazofijo");
botonConfirmarPlazoFijo.addEventListener("click",constituirPlazoFijo);

function constituirPlazoFijo(){
    let montoPlazoFijo=Number(document.getElementById("montoPlazoFijo").value);
    let plazo=Number(document.getElementById("plazo").value);
    let interes = (montoPlazoFijo * tasaPF * plazo) / 36500;
    let montoACobrar = montoPlazoFijo + interes;
    let fechaHoy=new Date();
    let vencimiento= new Date(fechaHoy);
    vencimiento.setDate(fechaHoy.getDate()+plazo);
   
    if(montoPlazoFijo<=0){
        document.getElementById("montoACobrar").textContent=`El monto es invalido`;
        return;
    }
    if(plazo<=0){
        document.getElementById("montoACobrar").textContent=`El plazo es invalido`;
        return;
    }
    if (montoPlazoFijo>saldoActual){
        document.getElementById("montoACobrar").textContent=`El saldo es insuficiente`
    } else { saldoActual=saldoActual-montoPlazoFijo;
        consultarSaldo();
        document.getElementById("montoACobrar").textContent=`PLAZO FIJO REALIZADO - 
        CAPITAL: $${montoPlazoFijo.toFixed(2)} INTERES:$${interes.toFixed(2)} MONTO A COBRAR:$${montoACobrar.toFixed(2)}
        VENCIMIENTO:${vencimiento.toLocaleDateString()}`;

    }
    movimientos.push({
    tipo: "Plazo fijo",
    monto: montoPlazoFijo,
    fecha: new Date().toLocaleDateString(),
}); 
    mostrarHistorial();
}
let botonPagarServicio=document.getElementById("pagarServicio");
let botonConfirmarPago=document.getElementById("btnConfirmarPago");
botonConfirmarPago.addEventListener("click",pagarServicio);

function pagarServicio(){
    let servicio=document.getElementById("servicioInput").value;
    let codigoPago=document.getElementById("codigoPago").value;
    let montoServicio=Number(document.getElementById("montoServicio").value);

    if (servicio===""){
        document.getElementById("pagoServicio").textContent="Ingrese un servicio";
        return;
    }

    if (codigoPago===""){
        document.getElementById("pagoServicio").textContent="Ingrese código de pago";
        return;
    }

    if(montoServicio<=0){
        document.getElementById("pagoServicio").textContent="Ingrese un monto valido";
        return;
    }
    if (montoServicio>saldoActual){
        document.getElementById("pagoServicio").textContent="Saldo insuficiente"
    } else {
        saldoActual=saldoActual-montoServicio;
        consultarSaldo();
        document.getElementById("pagoServicio").textContent=`Se ha pagado el servicio ${servicio} por la suma de $${montoServicio}`;
    }
    movimientos.push({
    tipo: `Pago de Servicio ${servicio}`,
    monto: montoServicio,
    fecha: new Date().toLocaleDateString(),
}); 
    mostrarHistorial();

}


let botonesMenu = document.querySelectorAll("#menu button");
let secciones = document.querySelectorAll(".seccion");

botonesMenu.forEach(boton => {
    boton.addEventListener("click", () => {
        secciones.forEach(sec => sec.style.display = "none");
        let idSeccion = boton.dataset.seccion;
        document.getElementById(idSeccion).style.display = "block";
    });
});



function mostrarHistorial(){
    let lista=document.getElementById("historial");
    lista.innerHTML= "";

    movimientos.forEach(mov =>{
    let li=document.createElement("li");
    li.textContent =`${mov.fecha} - ${mov.tipo}- $${mov.monto}`;
    lista.appendChild(li);
});

}

let botonCerrarSesion=document.getElementById("btnCerrarSesion");
botonCerrarSesion.addEventListener("click",cerrarSesion);

function cerrarSesion(){
    document.getElementById("homebanking").style.display = "none";
    document.getElementById("login").style.display = "block";


    document.querySelectorAll("input").forEach(input => {
        input.value = "";
    });

 
    document.getElementById("validacionLogin").textContent = "";

    // ocultar secciones
    document.querySelectorAll(".seccion").forEach(sec => {
        sec.style.display = "none";
    });

    // resetear intentos
    intentos = 3;
    botonIngresar.disabled = false;
}
