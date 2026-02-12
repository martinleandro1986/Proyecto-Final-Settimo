let intentos=3;

let botonIngresar =document.getElementById("ingreso");
botonIngresar.addEventListener("click",validarLogin);

function validarLogin(){
     
        let usuario=Number(document.getElementById("usuarioProvisorio").value);
        let clave=Number(document.getElementById("claveProvisoria").value);
        if(usuario===1234 && clave===8888){
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
    





let saldoActual=50000;
let saldoElemento=document.getElementById("saldo");

let botonConsultarSaludo=document.getElementById("consultarSaldo");
botonConsultarSaludo.addEventListener("click",consultarSaldo);

function consultarSaldo(){
    saldoElemento.textContent=`El saldo actual es ${saldoActual}`;
}

consultarSaldo();


let botonTransferir = document.getElementById("botonTransferir");
botonTransferir.addEventListener("click", transferir);

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
     document.getElementById("validacionMontoT").textContent=`Se ha transferido la suma de $ ${montoIngresado} exitosamente`;

}}

let botonPrestamo=document.getElementById("botonPrestamo");
botonPrestamo.addEventListener("click",sacarPrestamo);


function sacarPrestamo(){
    let montoPreaprobado=5000000;
    let montoSolicitado=Number(document.getElementById("prestamo").value);

    if(montoPreaprobado<montoSolicitado){
        document.getElementById("validacionPrestamo").textContent="Ingrese un importe menor"
    } else {saldoActual=saldoActual + montoSolicitado;
        consultarSaldo();
        document.getElementById("validacionPrestamo").textContent=`El préstamo ha sido acreditado en su cuenta por el importe de ${montoSolicitado} con TNA 30% pagadero 24 cuotas mensuales`;
    }

}


let botonDolares=document.getElementById("botonDolares");
botonDolares.addEventListener("click",comprarDolares);

function comprarDolares(){
    let cotizacion=1460;
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
        document.getElementById("validacionDolares").textContent=`Usted ha comprado la cantidad de ${conversion} dólares equivalentes a $ ${montoPesos} `;

    }
}
let botonPlazoFijo=document.getElementById("botonPlazoFijo");
botonPlazoFijo.addEventListener("click",constituirPlazoFijo);

function constituirPlazoFijo(){
    let montoPlazoFijo=Number(document.getElementById("montoPlazoFijo").value);
    let plazo=Number(document.getElementById("plazo").value);
    let tasa=30;
    let montoACobrar=montoPlazoFijo+((montoPlazoFijo*tasa*plazo)/36500);
   
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
        document.getElementById("montoACobrar").textContent=`El monto a cobrar sumando capital e interes es igual a ${montoACobrar}`;

    }

}
let botonPagarServicio=document.getElementById("pagarServicio");
botonPagarServicio.addEventListener("click",pagarServicio);

function pagarServicio(){
    let servicio=document.getElementById("servicio").value;
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


}





//Agregar pago de servicio y plazo fijo 