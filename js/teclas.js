
var id_ultimo;
var color_act;
var color_des;
var tcelda; var nid = "";

// ponemos el foco en el primer campo de la pagina o formulario
$(document).ready(function(){
	$(':text')[0].focus();
})

// Funcion que se ejecuta cada vez que se pulsa una tecla en cualquier input
function test(e,id){ 
	var codigo;
    var valores = []; var valor;
    var fila; var colu;
    //operador condicional ternario (obtenemos la tecla pulsada)	
	(e.keyCode)?k=e.keyCode:k=e.which;
 	// controlamos las teclas pulsadas, y si el caracter pulsado es un numero 
    if (k==13 || k==39){   //intro y flecha a la derecha
    	if (id == 80){
    		id = 0;
    	}else{
    		id++;
    	} 	
		document.getElementById(id).focus();
    } else if (k==37){   // flecha a la izquierda
    	if (id == 0){
    		id = 80;
    	}else{
    		id--;
    	}
		document.getElementById(id).focus();
    // una fila mas, si esta en la 8 ira a la cero misma columna
    } else if (k==40){   // flecha abajo
    	idd = id;
    	idd =parseInt(idd);
    	if (idd > 71){
    		id = idd - 72;
    	} else{
    		id = idd + 9;
    	}
		document.getElementById(id).focus();
    // una fila menos, si esta en la cero ira a la ocho misma columna
    } else if (k==38){   // flecha arriba
    	idd = id;
    	idd =parseInt(idd);
    	if (id < 9){
			id = 72 + idd;
    	} else{
    		id = idd - 9;
    	}
		document.getElementById(id).focus();
    } else if (k==8){  //tecla blackspace
        ff=0;
    } else {
		// devuelve el valor entrado 
	    
        valor = document.getElementById(id).value;
	    // devuelve el codigo del caracter tecleado
	    codigo = valor.charCodeAt();
	    if ((codigo > 48) && (codigo < 58)){
	     	if (id == 80){
	     		id = 0;
	     	}else{
	     		id; //++;
	     	}
			document.getElementById(id).focus();
	    }
	    else{
	    	// borra el caracter entrado
            document.getElementById(id).value = "";
	    }
    }
    var z = 0; var y; var x;
    for(y = 0; y < 9; y++){
        for(x = 0; x < 9; x++){ 
            valor = parseInt(document.getElementById(z).value); 
            if(valor > 0 && valor < 10){
                sudoku[y][x] = valor;
            }else{valor = 0;}
            z++;
        }          
    }
    colocar_numeros_posibles_en_las_celdas_y_resolver_posibles_unicos(false); 
    fila = parseInt(id / 9);
    colu = id - (fila * 9);
    var valores = posibles[fila][colu];
    $("#posi").val(" "+valores); 
    
    // cuando borramos una celda, aqui restituimos sus valores posibles
    nid = id.toString();
    if(nid.length < 2){
        tcelda ="0" + nid;
    }else{
        tcelda = nid;
    }
    if($("#" + tcelda).val() == ""){
        sudoku[fila][colu] = 0;
        let valor = numeros_posibles_de_la_celda(fila,colu);
        $("#posi").val(valor); 
    }
}

/*
detectamos donde se hace click en todo momento, y lo utilizamos para colocar un 
numero en la celda que se ha hecho click
*/
$(document).click(function(){
    var elid;
    var valor;
    elid = document.activeElement.id;
    valor = document.activeElement.value;
    if (elid != "undefined" && elid != ""){
        if(elid > -1 && elid < 81){
            id_ultimo = elid;

            //valor = parseInt(document.getElementById(id_ultimo).value);
            var fila = parseInt(id_ultimo / 9);
            var colu = id_ultimo - (fila * 9);
            var valores = posibles[fila][colu];
            $("#posi").val(" "+valores);
        }
    }
})

color_des = '#ABABAB';   // color cuando el boton esta desactivado gris
color_act = '#A9E7BE';   // color cuando el boton esta activado verde mas fuerte

// la ventana dialogo  de jquery-ui  para introducir los numeros iniciales para el sudoku.
$(document).ready(function() {
    $("#dat_ini").dialog({
        resizable: false,
        height: "auto",
        width: 310,
        autoOpen: false,
        modal: true,
        buttons: {
            "Aceptar": function () {
            $(this).dialog("close");
            desactivar_generar_y_buscar_numeros_iniciales();
            }
        }
    });
    $( "#generar" ).on( "click", function() {
        $("#mod").val("Si la elección de celdas iniciales es de (20 a 23) o (35 a 40) la selección" +
        " de las\n" +"celdas se pueden demorar debido a la complejidad de selección ");
        $( "#dat_ini" ).dialog( "open" );
    });
});

function desactivar_generar_y_buscar_numeros_iniciales(){
    celdas_iniciales = parseInt($("#ini").val());
    $("#ini").val(20);
    $("#generar").css("background", color_des);
    $("#entrar").css("background", color_des);
    $("#generar").attr("disabled", true);
    $("#entrar").attr("disabled", true);

    //$("#generar").disabled=true;
    //$("#entrar").disabled=true;
    sudoku_aleatorio();
}

// evitamos que las celdas como solo lectura sean borradas con blackspace
$(document).ready(function(){
    $('input').keydown(function(e) {
        if(e.which === 8){ 
            if($("#" + tcelda).attr('readonly') == 'readonly'){
                return false; 
            }
        } 
    });
});