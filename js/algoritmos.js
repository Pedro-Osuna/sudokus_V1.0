/*
    importante
    tanto el disabled como el readonly  debemos colocarlo  =>  ('disabled', true) ('readonly', true)
    no debemos olvidar el true sin comillas.
    para habilitar usaremos  removeAttr('disabled')  removeAttr('readonly')
*/

h = m = s = "00";

var dificultad = "";
var celdas_iniciales; 

var sudoku = new Array(9);
for (let i = 0; i < 9; i++){
    sudoku[i] = new Array(9);    
}
// guardamos las celdas estampadas de forma segura 
var sudoku_ori = new Array(9);
for (let i = 0; i < 9; i++){
    sudoku_ori[i] = new Array(9);    
}

// guardamos el sudoku resuelto
var sudoku_resuelto = new Array(9);
for (let i = 0; i < 9; i++){
    sudoku_resuelto[i] = new Array(9);    
}

//guardamos las celdas iniciales
var sudoku_ini = new Array(9);
for (let i = 0; i < 9; i++){
    sudoku_ini[i] = new Array(9);    
}

// guarda en todo momento los numeros que son posibles en cada una de las celdas.
var posibles = new Array(9);
for (let i = 0; i < 9; i++){
    posibles[i] = new Array(9);
}

var posibles_ori = new Array(9);
for (let i = 0; i < 9; i++){
    posibles_ori[i] = new Array(9);
}

//Ejecutamos la funcion inicio una vez creada la pagina, una primera vez.
$(window).on("load", inicio);

function inicio(){
    // pongo disabled a true de todos los imputs de tipo text del formulario entradas
    h = "00";
    m = "00";
    s = "00";
    inicio_hora()
    $('#entradas input[type=text]').each(function(){
       $(this).attr("disabled", true); 
    });
    desabilitar_botones_crono();
    $('#inicio').attr("disabled", false);
    $("#entrar").attr("disabled", false);
    $("#generar").attr("disabled", false);
    $("#celda_ale").attr("disabled",true);
    $("#celda_act").attr("disabled",true);
    $("#compruebo_celdas").attr("disabled",true);
    $("#compruebo_sudoku").attr("disabled",true);
    $("#resuelvo").attr("disabled",true);
    //$("#salir").attr("disabled", false);
    // //colores
    $("#inicio").css('background', color_act);
    $("#entrar").css('background', color_act);
    $("#generar").css('background', color_act);
    $("#celda_ale").css('background', color_des);
    $("#celda_act").css('background', color_des);
    $("#compruebo_celdas").css('background', color_des);
    $("#compruebo_sudoku").css('background', color_des);
    $("#resuelvo").css('background', color_des);
}

/*
Preparamos el sudoku a blancos y los botones a su estado inicial, y esperamos 
a que se pulse algun boton. 
*/
function poner_a_inicio(){
    desabilitar_botones_crono();
    $("#segundos").val("00");
    $("#minutos").val("00");
    $("#horas").val("00");
    inicio();
    poner_a_blancos_sudoku();
    $("#comen").val("");
}

/*
Non permite introducir los numeros iniciales del sudoku a mano, una vez introducidos, y pulsado
el boton (comprobar celdas) si son correctos los numeros entrados, podremos  resolverlo.
*/
function sudoku_a_mano(){
    $("#entrar").attr("disabled", true);
    $("#generar").attr("disabled", true);
    $("#entrar").css('background', color_des);
    $("#generar").css('background', color_des);
    $("#compruebo_celdas").attr("disabled",false);
    $("#compruebo_celdas").css('background', color_act);
    // pongo disabled a false a todos los imputs de tipo text del formulario entradas
    $('#entradas input[type=text]').each(function(){
        $(this).removeAttr("disabled"); 
        $(this).removeAttr("readonly"); 
    });
    $("#comen").val("Introduzca los números en las celdas, una vez los tenga introducidos\n " +
    " pulse el botón ->(verificar celdas iniciales)");
}

/*
Rellena el sudoku con las celdas iniciales en fondo blanco
y comprueba que los numeros introducidos sean correctos a las normas de resolucion de sudokus.
y resuelve el sudoku mantneiendo los valores en el array sudoku, si lo ha podido resover, si no nos 
indica que probemos otros numeros.
*/
function comprobar_celdas_iniciales(){
    /*
    estampamos en el sudoku los valores introducidos.
    guardamos en celdas iniciales la cantidad de valores estampados inicialmente.
    guardamos en dificultad el grado de dificultad, segun valores iniciales.
    */
    var info= "";
    //var valor =0;
    var iid = 0;
    var num;
    var celdas_con_valor = 0   // contamos las celdas que tienen un valor de 1 a 9
    var datos_correctos = false;
    $("#comen").val("");
    for (let y=0; y<9; y++){
        for (let x=0; x<9; x++){
            iid = (y * 9) + x;
            num = document.getElementById(iid).value;
            if (num != ""){
                sudoku[y][x] = parseInt(num);
                sudoku_ini[y][x] = parseInt(num);
                celdas_con_valor++;
    
                if(sudoku_ini[y][x] != 0){
                    var iid = (y * 9) + x;
                    document.getElementById(iid).value = num;
                    document.getElementById(iid).style.background = '#A9E7BE'; //"#DDD";
                }

            }else{
                sudoku[y][x] = 0;
                sudoku_ini[y][x] = 0;
            }
        }    
    }
    if(celdas_con_valor >= 17){
        // comprobamos que los numeros introducidos cumplen las normas del sudoku
        colocar_numeros_posibles_en_las_celdas_y_resolver_posibles_unicos(false);
        if (comprobar_valores_y_ceros_de_celdas_cumplan_normas_sudoku()){
            if (celdas_con_valor <= 21){
                dificultad = "Extrema"; 
            }else if (celdas_con_valor <= 24){
                dificultad = "Experto"; 
            }else if (celdas_con_valor <= 27){
                dificultad = "Dificil";
            }else {dificultad = "Fácil";}
            info = "Los " + celdas_con_valor + " valores iniciales introducidos son conformes a" +
            " las normas.\n" + "La dificultad en su solución la englobamos\n" + 
            " como-> " + dificultad ;
            if(!resolver_sudoku_a_mano()){
                info = "Valores iniciales muy complejos, pruebe otros valores";
                datos_correctos = false;
            }else{
                for (let fi = 0; fi < 9; fi++){
                    for (let co = 0; co < 9; co++){
                        sudoku_resuelto[fi][co] = sudoku[fi][co];
                        sudoku[fi][co] = sudoku_ini[fi][co];
                    }
                }
                // pongo las celdas con numeros del 1 al 9 en solo lectura
                // el resto de celdas las habilito
                //que contengan un numero, y a false el resto
                $('#entradas input[type=text]').each(function(){
                    if($(this).val() != 0){
                        $(this).attr("readonly", true);
                    }
                    $(this).removeAttr("disabled");
                });
                info= "--SUERTE EN LA SOLUCION DEL SUDOKU--";
                datos_correctos = true;
                inicio_crono();
            }
        }else{ 
            info = "Los datos introducidos << NO >> son conformes a las normas " +
            "\nde resolución de sudokus";
            datos_correctos = false;
        }
    }else{
        datos_correctos = false;
        info = "Los datos iniciales introducidos son  " + celdas_con_valor + 
        "\nEl sudoku tendria varias disposiciones de sus numeros posibles" +
        "\nBuscamos sudokus que ofrezcan solo un resultado posible final y unico";
    }
    if(datos_correctos){
        $("#pausa").attr("disabled", false);
        $("#pausa").css('background', color_act);
        $("#comen").val(info);
        //estado_botones_inicial();
        $("#celda_ale").attr("disabled",false);
        $("#celda_act").attr("disabled",false);
        $("#compruebo_celdas").attr("disabled",true);
        $("#compruebo_sudoku").attr("disabled",false);
        $("#resuelvo").attr("disabled",false);
        $("#celda_ale").css('background', color_act);
        $("#celda_act").css('background', color_act);
        $("#compruebo_celdas").css('background', color_des);
        $("#compruebo_sudoku").css('background', color_act);
        $("#resuelvo").css('background', color_act);
    }else{
        $("#comen").val(info);
    }
    return;
}

function sudoku_aleatorio(){
    $('#entradas input[type=text]').each(function(){
        //  pongo todas las celdas lectura y escritura
        // habilito todos los imputs de tipo text del formulario entradas
        $(this).removeAttr("disabled"); 
        $(this).removeAttr("readonly"); 

    });
    poner_a_blancos_sudoku();
    con_mis_algoritmos();
    return;
}

/*
genera un sudoku  con mis propios algoritmos
los numeros iniciales en los extremos de 20 o 40 tardan mas en completarse, debido a que 
es mas complejo  cuadrar los numeros de forma que cumplan las normas de un sudoku.
*/
function con_mis_algoritmos(){
    var iid;
    var num;
    var sudoku_ok;
    var hacer = 5000;
    var numeros_valores_ini;
    var numeros_valores_fin;
    var cant_bucle = 0;
    while(true){
        generar_sudoku_con_mis_algorimos(); 
        // visualizo las celdas iniciales en pantalla
        for (let y=0; y<9; y++){
            for (let x=0; x<9; x++){
                sudoku_ini[y][x] = sudoku[y][x];
                iid = (y * 9) + x;
                num = sudoku[y][x];
                if(num != 0){
                    document.getElementById(iid).value = num;
                    document.getElementById(iid).style.background = "#DDD";                     
                }
            }    
        }
        sudoku_ok = false;
        while (true){
            numeros_valores_ini = cantidad_valores_tiene_el_sudoku();
            procesos_algoritmos();
            if (comprobar_valores_y_ceros_de_celdas_cumplan_normas_sudoku()){            
                if(cantidad_valores_tiene_el_sudoku() == 81){
                    sudoku_ok = true;
                }else{
                    if(buscando_solucion_probando_con_celdas_que_tienen_solo_dos_numeros_posibles()){
                        sudoku_ok = true;
                    }else{
                        numeros_valores_fin = cantidad_valores_tiene_el_sudoku();    
                    }
                }    
                if(sudoku_ok){
                    $("#pausa").attr("disabled", false);
                    $("#pausa").css('background', color_act);
                    $("#comen").val("--SUERTE EN LA SOLUCION DEL SUDOKU--");
                    $("#celda_ale").attr("disabled",false);
                    $("#celda_act").attr("disabled",false);
                    $("#compruebo_sudoku").attr("disabled",false);
                    $("#resuelvo").attr("disabled",false);
                    $("#celda_ale").css('background', color_act);
                    $("#celda_act").css('background', color_act);
                    $("#compruebo_sudoku").css('background', color_act);
                    $("#resuelvo").css('background', color_act);
                    for (let fi = 0; fi < 9; fi++){
                        for (let co = 0; co < 9; co++){
                            sudoku_resuelto[fi][co] = sudoku[fi][co];
                            sudoku[fi][co] = sudoku_ini[fi][co];
                        }
                    } 
                    colocar_numeros_posibles_en_las_celdas_y_resolver_posibles_unicos(false);   
                    // pongo a solo lectura las celdas que sean distintas de cero 
                    // dejo todas las celdas habilitadas
                    $('#entradas input[type=text]').each(function(){
                        if($(this).val() != 0){
                            $(this).attr("readonly", true);
                        }
                        $(this).removeAttr("disabled");
                    });
                    inicio_crono();
                    return true;
                }
                if(numeros_valores_ini == numeros_valores_fin){
                    break;
                }
            }else{
                break;
            }
        }
        poner_a_blancos_sudoku();
        if(cant_bucle++ > hacer){break;}
    }
    $("#comen").val(" Se ha superado el tiempo, pruebe otros numeros iniciales");
    return false;
}

function resolver_sudoku_a_mano(){
    var iteracciones;
    var sudoku_ok = false;
    $("#comen").val("");    
    iteracciones = 0;
    while (iteracciones < 2000){
        colocar_numeros_posibles_en_las_celdas_y_resolver_posibles_unicos(true);
        procesos_algoritmos();
        //guardar_a_ori(); 
        if (comprobar_valores_y_ceros_de_celdas_cumplan_normas_sudoku()){            
            guardar_a_ori();
            if(cantidad_valores_tiene_el_sudoku() == 81){
                sudoku_ok = true;
            }else{
                if(buscando_solucion_probando_con_celdas_que_tienen_solo_dos_numeros_posibles()){
                    sudoku_ok = true;
                }else{
                    guardar_desde_ori();
                }
            }
            if(sudoku_ok){
                for (let fi = 0; fi < 9; fi++){
                    for (let co = 0; co < 9; co++){
                        sudoku_resuelto[fi][co] = sudoku[fi][co];
                    }
                }
                return true;                
            } 
        }
        iteracciones++;
    }
    return false;
}

/*
rellena la celda activa con el numero conforme al sudoku resuelto. 
*/
function ayuda_celda_activa(){
    // id_ultimo es una variable global declarada en el fichero teclas.js
    var idd ;
    var cont;
    var num ;
    if (id_ultimo != "" && id_ultimo != "undefined"){
        cont = 0;
        for (let nfi=0;nfi<9;nfi++){
            for (let nco=0;nco<9;nco++){
                if(cont == id_ultimo){
                    num = sudoku_resuelto[nfi][nco] 
                    if (num != 0){
                        iid = (nfi * 9) + nco;
                        document.getElementById(iid).value = num;
                        document.getElementById(iid).style.background = '#FF7A33'
                        $('#'+iid).attr("readonly", true);
                        sudoku[nfi][nco] = num;
                    }                    
                }
                cont++;
            }
        }
    }
    id_ultimo = "";
}

/*
rellena de forma aleatoria una celda con el numero conforme al sudoku resuelto. 
*/
function ayuda(){
    var iid;
    var nfi;
    var nco;
    var num;
    var hacer = true;
    while(hacer){
        iid;
        nfi = Math.round(Math.random()*8);
        nco = Math.round(Math.random()*8);
        num = sudoku_resuelto[nfi][nco]; 

        if (num != 0){
            iid = (nfi * 9) + nco;
            document.getElementById(iid).value = num;
            document.getElementById(iid).style.background = "#AC33FF"
            $('#'+iid).attr("readonly", true);
            sudoku[nfi][nco] = num; 
            hacer = false;
        }
    }
}

/*
Cerramos la pagina web
*/
function close_window() {
    if (confirm("Cerrar la Web?")) {
        close();
    }
}

function resolver_sudoku(){
    var num;
    var iid;
    //estado_botones_inicial();
    for (let fi = 0; fi < 9; fi++){
        for (let co = 0; co < 9; co++){
            //num = sudoku[fi][co]; 
            num = sudoku_resuelto[fi][co]; 
            if (num != 0){
                iid = (fi * 9) + co;
                document.getElementById(iid).value = num;
            }
        }
    }
    $("#celda_ale").attr("disabled",true);
    $("#celda_act").attr("disabled",true);
    $("#compruebo_sudoku").attr("disabled",false);
    $("#resuelvo").attr("disabled",false);
    $("#celda_ale").css('background', color_des);
    $("#celda_act").css('background', color_des);
    $("#compruebo_sudoku").css('background', color_act);
    $("#resuelvo").css('background', color_des);
    $("#comen").val("---Sudoku resuelto---");
    desabilitar_botones_crono();
    $("#posi").val(" ");  //borramos el valor de posibles

    
    colocar_numeros_posibles_en_las_celdas_y_resolver_posibles_unicos(false); 
}

function procesos_algoritmos(){
    var total_algoritmos = 0;
    var hacer = true;
    var estampados = 0;
    var estampados_acumulado = 0;
    var zonas;
    while (hacer){
        hacer = false;
        for (let n of [0,1,2]){
            estampados = deducir_celdas_a_estampar_entre_grupos_de_tres_fi_o_co(n, 'fi');  
            estampados_acumulado += estampados;
        }
        for (let n of [0,1,2]){
            estampados = deducir_celdas_a_estampar_entre_grupos_de_tres_fi_o_co(n, 'co');  
            estampados_acumulado += estampados;
        }
        for (let fi of [0,1,2,3,4,5,6,7,8]){
            estampados = dos_celdas_con_dos_numeros_posibles_iguales_en_una_fila(fi); 
            estampados_acumulado += estampados;
        }
        for (let co of [0,1,2,3,4,5,6,7,8]){
            estampados = dos_celdas_con_dos_numeros_posibles_iguales_en_una_columna(co); 
            estampados_acumulado += estampados;
        }
        zonas =[[0,0],[0,3],[0,6],[3,0],[3,3],[3,6],[6,0],[6,3],[6,6]];
        for (let zona of zonas){
            estampados = dos_celdas_con_dos_numeros_posibles_iguales_en_una_zona(zona); 
            estampados_acumulado += estampados;
        }
        for (let fi of [0,1,2,3,4,5,6,7,8]){
            estampados = buscar_numero_posibles_que_se_encuentren_en_una_unica_celda_de_toda_la_fila(fi); 
            estampados_acumulado += estampados;
        }
        for (let co of [0,1,2,3,4,5,6,7,8]){
            estampados = buscar_numero_posibles_que_se_encuentren_en_una_unica_celda_de_toda_la_columna(co); 
            estampados_acumulado += estampados;
        }
        zonas =[[0,0],[0,3],[0,6],[3,0],[3,3],[3,6],[6,0],[6,3],[6,6]];
        for (let zona of zonas){
            estampados = buscar_numero_posibles_que_se_encuentren_en_una_unica_celda_de_toda_la_zona(zona); 
            estampados_acumulado += estampados;
        }
        estampados = detectamos_cual_es_unico_numero_posible_de_entre_todos_los_de_la_celda(); 
        estampados_acumulado += estampados;
        
        
        estampados = detectar_incoherencias_y_asegurar_numeros_a_estampar_de_los_dos_posibles_de_una_celda_por_filas();
        estampados_acumulado += estampados;

        estampados = detectar_incoherencias_y_asegurar_numeros_a_estampar_de_los_dos_posibles_de_una_celda_por_columnas();
        estampados_acumulado += estampados;

        total_algoritmos += estampados_acumulado;
        if (estampados_acumulado > 0){hacer = true;}
        estampados_acumulado = 0;
    }
    return total_algoritmos;
}

/*
Comprobamos que el valor_celda de la celda indicada por fila_celda y columna_celda,
cumpla con las normas del sudoku, devolvemos true si cumple en caso contrario false.
Si el valor_celda es 0 comprobamos si la celda tiene numeros posibles a estampar, devolvemos true si
tiene numeros posibles en caso contrario false.
*/
function comprobar_que_celda_cumpla_normas_sudoku(fila_celda, columna_celda, valor_celda){
    var fila_fila = fila_celda
    var columna_fila = columna_celda;
    var valores_posibles;
    if (valor_celda > 0 && valor_celda < 10){
        // recorremos todas las columnas de la fila donde esta la celda
        for (let columna_fila = 0; columna_fila < 9; columna_fila++){
            if (columna_fila != columna_celda) {
                if (sudoku[fila_celda][columna_fila] == valor_celda){
                    return false;
                }
            }
        }
        // recorremos las filas de la columna donde esta la celda
        for (let fila_fila = 0; fila_fila < 9; fila_fila++){
            if (fila_fila != fila_celda) {
                if (sudoku[fila_fila][columna_celda] == valor_celda){
                    return false;
                }
            }
        }
        // determinamos la zona a la que pertenece la celda que tratamos
        var zona = determinar_zona_de_una_celda(fila_celda, columna_celda)
        var fila_inicio = zona[0]; var columna_inicio = zona[1];
        var fila_final = zona[0] + 2; var columna_final = zona[1] + 2;
        // recorremos todas las filas y columnas de la zona  donde esta la celda
        for (let fila = fila_inicio ; fila <= fila_final; fila++){
            for (let columna = columna_inicio ; columna <= columna_final; columna++){
                if (fila_celda != fila || columna_celda != columna){
                   if(sudoku[fila][columna] == valor_celda){
                       return false;
                   }
                } 
            }
        }
    }
    if(valor_celda == 0){
        //comprobamos que la celda con cero, tengan numeros posibles
        valores_posibles = posibles[fila_celda][columna_celda];
        if(valores_posibles.length == 0){
            return false;
        }
    }
    return true;
}

/*
Comprobamos que los valores de las celdas cumplan con las normas del sudoku.
Aquellas celdas que contengan ceros, estos no tengan incoherencias. 
(Que en su lugar se pueda colocar algun numero del 1 al 9 cumpliendo las normas de los sudokus,
cuando corresponda.
Devolvemos true si todos son correctos y false en caso contrario.
*/
function comprobar_valores_y_ceros_de_celdas_cumplan_normas_sudoku(){  
    var valor_celda;
    var valores_posibles = [];
    //var cant = 0;
    for (let fila_celda = 0; fila_celda < 9; fila_celda++){
        for (let columna_celda = 0; columna_celda < 9; columna_celda++){
            valor_celda = sudoku[fila_celda][columna_celda];
            if (valor_celda > 0 && valor_celda < 10){
                // recorremos todas las columnas de la fila donde esta la celda
                for (let columna_fila = 0; columna_fila < 9; columna_fila++){
                    if (columna_fila != columna_celda) {
                        if (sudoku[fila_celda][columna_fila] == valor_celda){
                            return false;
                        }
                    }
                }
                // recorremos todas las filas de la columna donde esta la celda
                for (let fila_fila = 0; fila_fila < 9; fila_fila++){
                    if (fila_fila != fila_celda) {
                        if (sudoku[fila_fila][columna_celda] == valor_celda){
                            return false;
                        }
                    }
                }
                // determinamos la zona a la que pertenece la celda que tratamos
                var zona = determinar_zona_de_una_celda(fila_celda, columna_celda)
                var fila_inicio = zona[0]; var columna_inicio = zona[1];
                var fila_final = zona[0] + 2; var columna_final = zona[1] + 2;
                // recorremos todas las filas y columnas de la zona  donde esta la celda
                for (let fila = fila_inicio ; fila <= fila_final; fila++){
                    for (let columna = columna_inicio ; columna <= columna_final; columna++){
                        if (fila_celda != fila || columna_celda != columna){
                           if(sudoku[fila][columna] == valor_celda){
                               return false;
                           }
                        } 
                    }
                }
            }else{
                //comprobamos que celdas con cero, tengan numeros posibles
                valores_posibles = posibles[fila_celda][columna_celda];
                if(valores_posibles.length == 0){
                    return false;
                }
            }

        }
    }
    return true;
} 

/*
devuelve la cantidad de valores que tiene ya resueltos el sudoku
*/
function cantidad_valores_tiene_el_sudoku(){
    var cant = 0;
    for (let y = 0; y < 9; y++){
        for (let x = 0; x < 9; x++){
            if(sudoku[y][x] != 0){cant++;}
        }
    }
    return cant;
}

function determinar_zona_de_una_celda(fi, co){ 
    /*
    fi-> fila donde se encuentra la celda
    co-> columna donde se encuentra la celda
    Devolvemos: un array con el inicio de la fila y columna de la zona.
    */
    //var fiz; var coz;
    var fila_inicial;
    var columna_inicial;
    if (fi < 3 && co < 3){
        fila_inicial = 0; columna_inicial = 0;
    }else if (fi < 3 && co < 6){
        fila_inicial = 0; columna_inicial = 3;
    }else if (fi < 3 && co < 9){
        fila_inicial = 0; columna_inicial = 6;
    }else if (fi < 6 && co < 3){
        fila_inicial = 3; columna_inicial = 0;
    }else if (fi < 6 && co < 6){
        fila_inicial = 3; columna_inicial = 3;
    }else if (fi < 6 && co < 9){
        fila_inicial = 3; columna_inicial = 6;
    }else if (fi < 9 && co < 3){
        fila_inicial = 6; columna_inicial = 0;
    }else if (fi < 9 && co < 6){
        fila_inicial = 6; columna_inicial = 3;
    }else if (fi < 9 && co < 9){
        fila_inicial = 6; columna_inicial = 6;
    }
    return [fila_inicial, columna_inicial];
}

function resolver_celdas_con_un_solo_numero_en_posibles(){
    var estampados;
    var numeros_posibles;
    for (let fila = 0; fila < 9; fila++){
        for (let columna = 0; columna < 9; columna++){
            numeros_posibles = posibles[fila][columna];
            if(numeros_posibles.length == 1){
                sudoku[fila][columna] = numeros_posibles[0];
                posibles[fila][columna] = [];
                estampados =  1;
                return true;
            }
        }
    }
    return false; 
}

function colocar_numeros_posibles_en_las_celdas_y_resolver_posibles_unicos(posibles_unicos_si_no){ 
    /*
    posibles_unicos_si_no-> si queremos que resuelva posibles unicos, pondremos true y si no false
    Devuelve: el numero de celdas estampadas.
    */
    //var estampados = 0;
    var estampados_acumulado = 0;
    var hacer = true;
    var va;
    while (hacer){
        hacer = false;
        for (let fila = 0; fila < 9; fila++){
            // vemos que numeros hay en la fila
            let numeros_fila = numeros_que_hay_en_las_celdas_de_la_fila(fila);
            for (let columna = 0; columna < 9; columna++){
                if (sudoku[fila][columna] == 0){
                    //vemos que numeros hay en la columna
                    let numeros_columna = numeros_que_hay_en_las_celdas_de_la_columna(columna);
                    //vemos que numeros hay en la zona
                    let numeros_zona = numeros_que_hay_en_las_celdas_de_la_zona(fila, columna);
                    // quitamos los elementos que esten repetidos
                    let todos_los_numeros = numeros_fila.concat(numeros_columna, numeros_zona);
                    let numeros_no_repetidos =  quitar_elementos_repetidos_de_array(todos_los_numeros);
                    var numeros_posibles = [];
                    //guardo los numeros del 1 al 9 que no esten incluidos en el array numeros_no_repetidos
                    for (let num = 1; num < 10; num++){
                        if (!numeros_no_repetidos.includes(num)){numeros_posibles.push(num)}
                    }
                    posibles[fila][columna] = numeros_posibles;
                }else{posibles[fila][columna] = [];}    
            }
        }
        if(posibles_unicos_si_no){
            if(resolver_celdas_con_un_solo_numero_en_posibles()){
                estampados_acumulado++;
                hacer = true;
            }
        }else{hacer = false;}

    }
    return estampados_acumulado;
}

function numeros_que_hay_en_las_celdas_de_la_fila(fi){ 
    /*
    fi->fila a encontrar los numeros de las celdas
    devolvemos: en un array los valores de cada celda de la fila
    */
    var numeros_en_fila = [];
    numeros_en_fila = sudoku[fi];
    return numeros_en_fila;
}

function numeros_posibles_que_hay_en_las_celdas_de_una_fila(fi){ 
    /*
    fi->fila para encontrar los numeros posibles de sus celdas
    devolvemos: en un array todos los valores posibles de cada celda de la fila
    */
    var posibles_en_fila = []; 
    posibles_en_fila = posibles[fi];
    return posibles_en_fila;
}

function numeros_que_hay_en_las_celdas_de_la_columna(co){ //--
    /*
    co->columna para  encontrar los numeros de sus celdas
    devolvemos: en un array los valores de cada celda de la fila
    */
    var numeros_en_columna = [];
    for (let fila = 0; fila < 9; fila++){
        numeros_en_columna.push(sudoku[fila][co]);           
    }
    return numeros_en_columna;
}

function numeros_posibles_que_hay_en_las_celdas_de_una_columna(co){ //--
    /*
    co->columna para encontrar los numeros posibles de sus celdas
    devolvemos: en un array todos los valores posibles de cada celda de la columna
    */
    var posibles_en_columna = [];
    for (let fila = 0; fila < 9; fila++){
        posibles_en_columna.push(posibles[fila][co]); 
    }
    return posibles_en_columna;
}

function numeros_que_hay_en_las_celdas_de_la_zona(fi, co){ //--
    /*
    fi->fila que ocupa la celda
    co->columna que ocupa la zona
    devolvemos: en un array los valores de cada una de la celdas de la zona
    */
    var numeros_zona = [];
    var zona = determinar_zona_de_una_celda(fi, co);
    var fila_inicio = zona[0]; var columna_inicio = zona[1];
    var fila_final = zona[0] + 2; var columna_final = zona[1] + 2;
    for (let fila = fila_inicio ; fila <= fila_final; fila++){
        for (let columna = columna_inicio ; columna <= columna_final; columna++){
            if (sudoku[fila][columna] != 0){
                numeros_zona.push(sudoku[fila][columna]);
            }
        }
    }
    return numeros_zona;
}

function numeros_posibles_que_hay_en_las_celdas_de_una_zona(fi, co){ //--
    /*
    fi->fila que ocupa la celda
    co->columna que ocupa la celda
    devolvemos: en un array los valores posibles  de cada una de la celdas de la zona
    */
    var numeros_posibles = [];
    var zona = determinar_zona_de_una_celda(fi, co);
    var fila_inicio = zona[0]; var columna_inicio = zona[1];
    var fila_final = zona[0] + 2; var columna_final = zona[1] + 2;
    for (let fila = fila_inicio ; fila <= fila_final; fila++){
        for (let columna = columna_inicio ; columna <= columna_final; columna++){
            numeros_posibles.push(posibles[fila][columna]);
        }
    }
    return numeros_posibles;
}

function quitar_elementos_repetidos_de_array(elementos){ //--
    /*
    elementos es un array
    devolvemos un array sin elementos repetidos
    */
    var elementos_sin_repeticion = [];
    for (let numero of elementos){
        if (numero != 0){
            if (!elementos_sin_repeticion.includes(numero)){
                elementos_sin_repeticion.push(numero);
            }
        }
    }
    return elementos_sin_repeticion;           
}

function deducir_celdas_a_estampar_entre_grupos_de_tres_fi_o_co(zona, fila_colu){
    /*
    zona-> nos indica la zona donde cogera las tres filas o columnas
    fila_colu-> nos indica si cogera filas o columnas 
    Devolvemos la cantidad de numeros estampados sin contar los de recomponer posibles.
    */
    var estampados_acumulado = 0;
    var estampados = 0;
    var grupos = [];
    var hacer = true;
    while(hacer){
        hacer = false;
        switch (zona){
            case 0:
                grupos = [[0,1,2],[1,2,0],[2,0,1]];
                break;
            case 1:
                grupos = [[3,4,5],[4,5,3],[5,3,4]];
                break;
            case 2:
                grupos = [[6,7,8],[7,8,6],[8,6,7]];
        }
        for (var grupo  of  grupos){
            if (fila_colu == 'fi'){
                var numeros0 = numeros_que_hay_en_las_celdas_de_la_fila(grupo[0]);
                var numeros1 = numeros_que_hay_en_las_celdas_de_la_fila(grupo[1]);
                var posibles2= numeros_posibles_que_hay_en_las_celdas_de_una_fila(grupo[2]);
            }else{
                var numeros0 = numeros_que_hay_en_las_celdas_de_la_columna(grupo[0]);
                var numeros1 = numeros_que_hay_en_las_celdas_de_la_columna(grupo[1]);
                var posibles2= numeros_posibles_que_hay_en_las_celdas_de_una_columna(grupo[2]);
            }
            for (let num of numeros0){
                if (numeros1.includes(num)){
                    // buscamos en posibles  ese numero en grupo[2]
                    var contador = 0;
                    var co_fi = 0;
                    for (let avar of posibles2){
                        if (avar.length > 0){
                            //si en avar esta el numero aumento el contador
                            if (avar.includes(num)){
                                contador++;
                                if (contador > 1){ break;} // salto el for
                                var c_f = co_fi; //fijo en c_f la fila o columna donde encuentro el numero
                            }
                        }
                        co_fi++
                    }
                    if (contador == 1){
                        // estampo en sudoku el numero num y en posibles pongo un array vacio
                        if (fila_colu == 'fi'){
                            sudoku[grupo[2]][c_f] = num;
                            estampados_acumulado +=  1; 
                            posibles[grupo[2]][c_f] = [];
                        }
                        if(fila_colu == 'co'){
                            sudoku[c_f][grupo[2]] = num;
                            estampados_acumulado += 1; 
                            posibles[c_f][grupo[2]] = [];
                        }
                        //recomponemos el array de posibles y salimos
                        estampados = colocar_numeros_posibles_en_las_celdas_y_resolver_posibles_unicos(true)
                        estampados_acumulado += estampados;
                        hacer = true;
                        break;
                    }
                }
            }
            if(hacer){break;}    
        }
    }
    return estampados_acumulado;
}

function dos_celdas_con_dos_numeros_posibles_iguales_en_una_fila(fi){
    /*
    fi-> fila que vamo a recorrer 
    devolvemos los estampados.
    */
    var a_dos = [];
    var a_tres = [];
    var estampados_acumulado = 0;
    var estampados = 0;
    var num_celdas_dos; var num_celdas_tres; var no_igual;
    var array1 = []; var array2 = []; var array3 = []; var iguales; var celda;
    var hacer = true;
    while(hacer){
        hacer = false;
        // llenamos los array a_dos y a_tres con las columnas de las celdas donde hay dos posibles y tres posibles 
        for (let co = 0; co < 9; co++){
            celda = posibles[fi][co];
            if (celda.length == 2){a_dos.push(co)}
            else if (celda.length == 3){a_tres.push(co)}
        }
        num_celdas_dos = a_dos.length;
        num_celdas_tres = a_tres.length;
        if ((num_celdas_dos >= 2) && (num_celdas_tres >= 1)){
            // hacemos un recorrido por todas las celdas que tiene dos numeros posibles
            for (let x = 0; x < num_celdas_dos; x++){
                array1 = posibles[fi][a_dos[x]];
                iguales = 0;
                for (let y = 0; y < num_celdas_dos; y++){
                    array2 = posibles[fi][a_dos[y]];    
                    if (comparo_dos_arrays(array1,array2)){
                        iguales++;
                    }        
                    if (iguales == 2){
                        //ahora buscamos si el de tres tiene los dos numeros
                        for (let x = 0; x < num_celdas_tres; x++){
                            array3 = posibles[fi][a_tres[x]];
                            iguales = 0;
                            for (let num of array3){
                                if (array1.includes(num)){
                                    iguales++;
                                }else{
                                    no_igual = num;
                                }
                            }
                            if (iguales == 2){
                                // estampo num en el sudoku y dejo en posibles un array vacio
                                sudoku[fi][a_tres[x]] = no_igual;
                                estampados_acumulado += 1 ; 
                                posibles[fi][a_tres[x]] = [];
                                //recomponemos el array de posibles y salimos
                                estampados = colocar_numeros_posibles_en_las_celdas_y_resolver_posibles_unicos(true);
                                estampados_acumulado += estampados;
                                hacer = true;
                                break;
                            }
                        }
                        if(hacer){break;}
                    }    
                }
                if(hacer){break;}
            }
        }
    }
    return estampados_acumulado;
}

function dos_celdas_con_dos_numeros_posibles_iguales_en_una_columna(co){
    /*
    co->columna  que vamos a recorrer 
    devolvemos los estampados.
    */
    var a_dos = [];
    var a_tres = [];
    var estampados_acumulado = 0;
    var estampados = 0;
    var celda; var iguales; var no_igual; var num_celdas_dos; var num_celdas_tres;
    var array1 = []; array2 = []; array3 = [];
    var hacer = true;
    while(hacer){
        hacer = false
        // llenamos los array a_dos y a_tres con las columnas de las celdas donde hay dos posibles y tres posibles 
        for (let fi = 0; fi < 9; fi++){
            celda = posibles[fi][co];
            if (celda.length == 2){a_dos.push(fi)}
            else if (celda.length == 3){a_tres.push(fi)}
        }
        num_celdas_dos =a_dos.length;
        num_celdas_tres = a_tres.length;
        if ((num_celdas_dos >= 2) && (num_celdas_tres >= 1)){
            // hacemos un recorrido por todas las celdas que tiene dos numeros posibles
            for (let x = 0; x < num_celdas_dos; x++){
                array1 = posibles[a_dos[x]][co];
                iguales = 0;
                for (let y = 0; y < num_celdas_dos; y++){
                    array2 = posibles[a_dos[y]][co];    
                    if (comparo_dos_arrays(array1,array2)){
                        iguales++;
                    }        
                    if (iguales == 2){
                        //ahora buscamos si el de tres tiene los dos numeros
                        for (let x = 0; x < num_celdas_tres; x++){
                            array_tres = posibles[a_tres[x]][co];
                            iguales = 0;
                            for (let num of array_tres){
                                if (array1.includes(num)){
                                    iguales++;
                                }else{
                                    no_igual = num;
                                }
                            }
                            if (iguales == 2){
                                // estampo num en el sudoku y dejo en posibles un array vacio
                                sudoku[a_tres[x]][co] = no_igual;
                                estampados_acumulado += 1; 
                                posibles[a_tres[x]][co] = [];
                                //recomponemos el array de posibles y salimos
                                estampados = colocar_numeros_posibles_en_las_celdas_y_resolver_posibles_unicos(true);
                                estampados_acumulado += estampados;
                                hacer = true;
                                break;
                            }
                        }
                        if(hacer){break;}
                    }    
                }
                if(hacer){break;}
            }
        }
    }
    return estampados_acumulado;
}

function dos_celdas_con_dos_numeros_posibles_iguales_en_una_zona(zona){
    /*
    zona ->nos indica la fila y columna inicial de la zona
    devolvemos el numero de estampados
    */
    var fi = zona[0];
    var co = zona[1];
    var a_dos = [];
    var a_tres = [];
    var estampados_acumulado = 0;
    var estampados = 0;
    var celda; var num_celdas_dos; var num_celdas_tres; var iguales; var no_igual; 
    var array1 = []; array2 = []; array3 = [];
    var hacer = true;
    while(hacer){
        hacer = false;
        for (let y = fi; y < fi+3; y++){
            for (let x = co; x < co+3; x++){
                celda = posibles[y][x];
                if (celda.length == 2){ a_dos.push([y,x]); }
                else if (celda.length == 3){ a_tres.push([y,x]); }
            }
        }
        num_celdas_dos =a_dos.length;
        num_celdas_tres = a_tres.length;
        if ((num_celdas_dos >= 2) && (num_celdas_tres >= 1)){
            // hacemos un recorrido por todas las celdas que tiene dos numeros posibles
            for (let x = 0; x < num_celdas_dos; x++){
                array1 = posibles[a_dos[x][0]][a_dos[x][1]];
                iguales = 0;
                for (let y = 0; y < num_celdas_dos; y++){
                    array2 = posibles[a_dos[y][0]][a_dos[y][1]];    
                    if (comparo_dos_arrays(array1,array2)){ iguales++; }        
                    if (iguales == 2){
                        //ahora buscamos si el de tres tiene los dos numeros
                        for (let x = 0; x < num_celdas_tres; x++){
                            array_tres = posibles[a_tres[x][0]][a_tres[x][1]];
                            iguales = 0;
                            for (let num of array_tres){
                                if (array1.includes(num)){
                                    iguales++;
                                }else{
                                    var no_igual = num
                                }
                            }
                            if (iguales == 2){
                                // estampo num en el sudoku y dejo en posibles un array vacio
                                sudoku[a_tres[x][0]][a_tres[x][1]] = no_igual;
                                estampados_acumulado += 1; 
                                posibles[a_tres[x][0]][a_tres[x][1]] = [];
                                //recomponemos el array de posibles y salimos
                                estampados = colocar_numeros_posibles_en_las_celdas_y_resolver_posibles_unicos(true);
                                estampados_acumulado += estampados;
                                hacer = true;
                                break;
                            }
                        }
                        if(hacer){break;}
                    }    
                }
                if(hacer){break;}
            }
        }
    }
    return estampados_acumulado;
} 

function buscar_numero_posibles_que_se_encuentren_en_una_unica_celda_de_toda_la_fila(fi){
    /*
    fi -> fila a recorrer
    devolvemos el numero de estampados.
    */
    var todos_los_posibles = [];
    var estampados_acumulado = 0;
    var estampados = 0;
    var columna; var numero; var contiene; var posibles_celda; var posibles_sin_repetir;
    var hacer = true;
    while (hacer){
        hacer = false;
        // llenamos array1 de todos los numeros posibles de todas las celdas de la fila
        for (let columna = 0; columna < 9; columna++){
            if (posibles[fi][columna].length != 0){
                for (let numeros of posibles[fi][columna]){
                    todos_los_posibles.push(numeros);
                }
            }    
        } 
        posibles_sin_repetir = quitar_elementos_repetidos_de_array(todos_los_posibles);    
        if(posibles_sin_repetir.length != 0){
            for (let numero_posible of posibles_sin_repetir){
                contiene = 0;
                for (let co = 0; co < 9; co++){
                    if (posibles[fi][co].length != 0){
                        posibles_celda = posibles[fi][co];
                        if (posibles_celda.includes(numero_posible)){
                            contiene++;
                            columna = co;
                            numero = numero_posible;
                        } 
                    }
                    if (contiene > 1){ break;}
                } 
                if (contiene == 1){
                    sudoku[fi][columna] = numero;
                    estampados_acumulado += 1; 
                    posibles[fi][columna] = [];
                    estampados = colocar_numeros_posibles_en_las_celdas_y_resolver_posibles_unicos(true);
                    estampados_acumulado += estampados;
                    hacer = true;
                    break;
                }  
            }
        }
    }
    return estampados_acumulado;
}

function buscar_numero_posibles_que_se_encuentren_en_una_unica_celda_de_toda_la_columna(co){
    /*
    co -> columna a recorrer
    devolvemos el numero de estampados.
    */
    var todos_los_posibles = [];
    //var array1 = [];
    var estampados_acumulado = 0;
    var estampados = 0;
    var fila; var numero; var contiene; var posibles_celda; var numero_posible;
    var posibles_sin_repetir = [];
    var hacer = true;
    while (hacer){
        hacer = false;
        for (let fila = 0; fila < 9; fila++){
            if (posibles[fila][co].length != 0){
                //array1 = posibles[fila][co];
                for (let numero of posibles[fila][co]){
                    todos_los_posibles.push(numero);
                }
            }    
        } 
        posibles_sin_repetir = quitar_elementos_repetidos_de_array(todos_los_posibles);    
        if(posibles_sin_repetir.length != 0){
            for (let numero_posible of posibles_sin_repetir){
                contiene = 0;
                //array1 = [];
                for (let fi = 0; fi < 9; fi++){
                    if (posibles[fi][co].length != 0){
                        posibles_celda = posibles[fi][co];
                        if (posibles_celda.includes(numero_posible)){
                            contiene++;
                            fila = fi;
                            numero = numero_posible;
                        } 
                    }
                    if (contiene > 1){ break; }
                } 
                if (contiene == 1){
                    sudoku[fila][co] = numero;
                    estampados_acumulado += 1; 
                    posibles[fila][co] = [];
                    estampados = colocar_numeros_posibles_en_las_celdas_y_resolver_posibles_unicos(true);
                    estampados_acumulado += estampados;
                    hacer = true;
                    break;
                }  
            }
        }
    }
    return estampados_acumulado;
}

function buscar_numero_posibles_que_se_encuentren_en_una_unica_celda_de_toda_la_zona(zona){
    /*
    zona ->nos indica la fila y columna inicial de la zona
    devolvemos el numero de estampados.
    */
    var fi = zona[0];
    var co = zona[1];
    var todos_los_posibles = [];
    //var array1 = [];
    var estampados_acumulado = 0;
    var estampados = 0;
    var fila; var columna; var numero; var contiene; var posibles_sin_repetir = []; 
    var posibles_de_celda;
    var hacer = true;
    while (hacer){
        hacer = false;
        for (let y = fi; y < fi+3; y++){
            for (let x = co; x < co+3; x++){
                if (posibles[y][x].length != 0){
                    for ( let num of posibles[y][x]){ todos_los_posibles.push(num);}
                }
            }
        }
        posibles_sin_repetir = quitar_elementos_repetidos_de_array(todos_los_posibles);    
        for (let numero_posible of posibles_sin_repetir){
            contiene = 0;
            for (let y = fi; y < fi+3; y++){
                for (let x = co; x < co+3; x++){
                    if (posibles[y][x].length != 0){
                        posibles_de_celda = posibles[y][x];
                        if (posibles_de_celda.includes(numero_posible)){
                            contiene++;
                            fila = y;
                            columna = x;
                            numero = numero_posible;
                        } 
                    }
                    if (contiene > 1){  break;}
                }
                if (contiene > 1){ break; }
            } 
            if (contiene == 1){
                sudoku[fila][columna] = numero;
                estampados_acumulado += 1; 
                posibles[fila][columna] = [];
                estampados = colocar_numeros_posibles_en_las_celdas_y_resolver_posibles_unicos(true);
                estampados_acumulado += estampados;
                hacer = true;
                break;
            }  
        }
    }
    return estampados_acumulado;
}

function detectamos_cual_es_unico_numero_posible_de_entre_todos_los_de_la_celda(){
    //devolvemos el numeros de estampados
    var estampados_acumulado = 0;
    var estampados = 0;
    var posibles_fila; var posibles_columna; var posibles_zona; var posibles_en_celda;
    var cantzona; var cantcolu; var cantfila;
    var hacer = true;
    while(hacer){
        hacer = false;  
        for (let fila = 0; fila < 9; fila++){
            for(let columna = 0; columna < 9; columna++){
                if (posibles[fila][columna].length != 0){
                    posibles_fila = numeros_posibles_que_hay_en_las_celdas_de_una_fila(fila);
                    posibles_columna = numeros_posibles_que_hay_en_las_celdas_de_una_columna(columna);
                    posibles_zona = numeros_posibles_que_hay_en_las_celdas_de_una_zona(fila, columna);
                    posibles_en_celda = posibles[fila][columna];
                    for(let numero of posibles_en_celda){
                        cantzona = 0; cantcolu = 0; cantfila = 0;
                        for (let numfila of posibles_fila){
                            if (numfila == numero){cantfila++;}
                        }
                        for (let numcolu of posibles_columna){
                            if (numcolu == numero){cantcolu++;}
                        }
                        for (let numzona of posibles_zona){
                            if (numzona == numero){cantzona++;}
                        }
                        if (cantfila == 1 && cantcolu == 1 && cantzona == 1){
                        //if (numfila == 1 && numcolu == 1 && numzona == 1){
                            sudoku[fila][columna] = numero;
                            estampados_acumulado += 1; 
                            posibles[fila][columna] = [];
                            estampados = colocar_numeros_posibles_en_las_celdas_y_resolver_posibles_unicos(true);
                            estampados_acumulado += estampados;
                            hacer = true;
                            break;
                        }
                    }
                    if(hacer){break;}
                }
            }
            if(hacer){break;}
        }
    }
    return estampados_acumulado;
}

function detectar_incoherencias_y_asegurar_numeros_a_estampar_de_los_dos_posibles_de_una_celda_por_filas(){
    //var celda_tratada = [];
    var fila_celda_tratada = [];
    var tres_filas = [];
    var dos_filas = [];
    var tres_zonas = [];
    var dos_zonas = [];
    var numeros_zonas = [];
    var fila_inicio_zona;
    var columna_inicio_zona;
    var numeros_posibles = [];
    var numeros_estampados = [];
    var numero_posible; 
    var estampados = 0; var pposible; var posi;
    var estampados_acumulado = 0; var ok; var no_ok;
    var solo_dos = selecciono_celdas_con_solo_dos_numeros_posibles();
    var zona_celda_tratada; var fi; var fii; var coi; var es_posible; var es_posible_num;
    
    if (solo_dos.length > 0){
        for (let celda_tratada of solo_dos){
            numeros_posibles = [];
            fila = celda_tratada[0];
            fila_celda_tratada = fila;
            columna = celda_tratada[1];
            numeros_posibles.push(celda_tratada[2]);
            numeros_posibles.push(celda_tratada[3]);
            // obtenemos la fila y columna inical de la zona de la tratada
            zona_celda_tratada  = determinar_zona_de_una_celda(fila, columna); 
            fila_inicio_zona    = zona_celda_tratada[0];
            columna_inicio_zona = zona_celda_tratada[1];
            // Seleccionamos las tres zonas pertenecientes a la fila de la celda tratada
            var fi = zona_celda_tratada[0];
            if (fi < 3){
                tres_zonas = [[fi,0],[fi,3],[fi,6]];  
            }else if (fi < 6){
                tres_zonas = [[fi,0],[fi,3],[fi,6]];  
            }else if (fi < 9){
                tres_zonas = [[fi,0],[fi,3],[fi,6]];
            }
            // seleccionamos las dos zonas que trabajaremos
            dos_zonas = [];
            for ( let zona of tres_zonas){
                if (zona[0] != zona_celda_tratada[0] || zona[1] != zona_celda_tratada[1]){dos_zonas.push(zona);}
            }
            // Seleccionamos las dos filas que trabajaremos
            dos_filas = [];
            for (let y = zona_celda_tratada[0]; y <= zona_celda_tratada[0] + 2; y++){
                if (fila_celda_tratada != y){dos_filas.push(y);} 
            }  
            // Seleccionamos los numeros estampados que hay en las dos zonas a trabajar
            numeros_estampados = [];
            for (let z = 0; z < 2; z++){
                fii = dos_zonas[z][0];
                coi = dos_zonas[z][1];
                numeros = [];
                for (let y = fii; y <= fii + 2; y++ ){
                    for (let x = coi; x <= coi + 2; x++ ){
                        if (sudoku[y][x] != 0){numeros.push(sudoku[y][x]);}
                    }
                }
                numeros_estampados.push(numeros);
            }
            // Iniciamos el proceso de buscar que numero de los dos posibles es incoherentes y el que podemos estampar
            //var numeros_posibles
            numeros_posibles = posibles[fila][columna];
            ok = [];
            no_ok = [];
            for (let numero_posible of numeros_posibles){
                // excluimos la zona a tratar donde tengamos un numero estampado igual al numero posible tratado
                es_posible_num = 0;
                zonas_a_tratar = [];
                if (numeros_estampados[0].includes(numero_posible)){
                    es_posible_num++;
                }else{ zonas_a_tratar.push(dos_zonas[0]);}
                if (numeros_estampados[1].includes(numero_posible)){
                    es_posible_num++;
                }else{zonas_a_tratar.push(dos_zonas[1]);}


                if (es_posible_num == 2){
                    ok.push(numero_posible);
                }else{
                    //recorremos las zonas a tratar
                    for (zona of zonas_a_tratar){
                        fii = zona[0];
                        coi = zona[1];
                        es_posible = 0;
                        for (let una_fila of dos_filas){
                            for (x = coi; x <= coi + 2; x++ ){
                                if (posibles[una_fila][x].length != 0){
                                    pposible = posibles[una_fila][x];
                                    if (pposible.includes(numero_posible)){
                                        es_posible++;
                                        break;
                                    }
                                }
                            }
                            if (es_posible > 0){break;}
                        }
                        if (es_posible == 0){
                            if(numeros_posibles[0] == numero_posible){
                                posi = numeros_posibles[1];
                            }else{posi = numeros_posibles[0]}
                            sudoku[fila][columna] = posi;
                            estampados++;
                        }

                    }
                }
            }
        }
        estampados += colocar_numeros_posibles_en_las_celdas_y_resolver_posibles_unicos(true);
        estampados_acumulado = estampados;
    }
    return estampados_acumulado;
}

function detectar_incoherencias_y_asegurar_numeros_a_estampar_de_los_dos_posibles_de_una_celda_por_columnas(){
    var celda_tratada = [];
    var fila_celda_tratada; 
    var columna_celda_tratada;
    var tres_columnas = [];
    var dos_columnas = [];
    var tres_zonas = [];
    var dos_zonas = [];
    var numeros_zonas = [];
    var fila_inicio_zona;
    var columna_inicio_zona;
    var numeros_posibles = [];
    var numeros_estampados = [];
    var zona_celda_tratada;
    var numero_posible; var es_posible_num; var es_posible; var pposible;
    var estampados = 0; var ok; var no_ok; var zonas_a_tratar; var posi;
    var estampados_acumulado = 0; var co; var fii; var coi; var numeros;
    var solo_dos = selecciono_celdas_con_solo_dos_numeros_posibles();
    
    if (solo_dos.length > 0){
        for (celda_tratada of solo_dos){
            numeros_posibles = [];
            fila = celda_tratada[0];
            fila_celda_tratada = fila;
            columna = celda_tratada[1];
            columna_celda_tratada = columna;
            numeros_posibles.push(celda_tratada[2]);
            numeros_posibles.push(celda_tratada[3]);
            // obtenemos la fila y columna inical de la zona tratada
            zona_celda_tratada  = determinar_zona_de_una_celda(fila, columna); 
            fila_inicio_zona    = zona_celda_tratada[0];
            columna_inicio_zona = zona_celda_tratada[1];
            // Seleccionamos las tres zonas pertenecientes a la fila de la celda tratada
            co = zona_celda_tratada[1];
            if (co < 3){
                tres_zonas = [[0,co],[3,co],[6,co]];  
            }else if (co < 6){
                tres_zonas = [[0,co],[3,co],[6,co]];  
            }else if (co < 9){
                tres_zonas = [[0,co],[3,co],[6,co]];
            }
            // seleccionamos las dos zonas que trabajaremos
            dos_zonas = [];
            for ( let zona of tres_zonas){
                if (zona[0] != zona_celda_tratada[0] || zona[1] != zona_celda_tratada[1]){dos_zonas.push(zona);}
            }
            // Seleccionamos las dos columnas que trabajaremos
            dos_columnas = [];
            for (let y = zona_celda_tratada[1]; y <= zona_celda_tratada[1] + 2; y++){
                if (columna_celda_tratada != y){dos_columnas.push(y);} 
            }  
            // Seleccionamos los numeros estampados que hay en las dos zonas a trabajar
            numeros_estampados = [];
            for (let z = 0; z < 2; z++){
                fii = dos_zonas[z][0];
                coi = dos_zonas[z][1];
                numeros = [];
                for (let y = fii; y <= fii + 2; y++ ){
                    for (let x = coi; x <= coi + 2; x++ ){
                        if (sudoku[y][x] != 0){numeros.push(sudoku[y][x]);}
                    }
                }
                numeros_estampados.push(numeros);
            }
            // Iniciamos el proceso de buscar que numero de los dos posibles es incoherentes y el que podemos estampar
            numeros_posibles = posibles[fila][columna];
            ok = [];
            no_ok = [];
            for (let numero_posible of numeros_posibles){
                // excluimos la zona a tratar donde tengamos un numero estampado igual al numero posible tratado
                es_posible_num = 0;
                zonas_a_tratar = [];
                if (numeros_estampados[0].includes(numero_posible)){
                    es_posible_num++;
                }else{ zonas_a_tratar.push(dos_zonas[0]);}
                if (numeros_estampados[1].includes(numero_posible)){
                    es_posible_num++;
                }else{zonas_a_tratar.push(dos_zonas[1]);}


                if (es_posible_num == 2){
                    ok.push(numero_posible);
                }else{
                    //recorremos las zonas a tratar
                    for (zona of zonas_a_tratar){
                        fii = zona[0];
                        coi = zona[1];
                        es_posible = 0;
                        for (let una_columna of dos_columnas){
                            for (y = fii; y <= fii + 2; y++ ){
                                if (posibles[y][una_columna].length != 0){
                                    pposible = posibles[y][una_columna];
                                    if (pposible.includes(numero_posible)){
                                        es_posible++;
                                        break;
                                    }
                                }
                            }
                            if (es_posible > 0){break;}
                        }
                        if (es_posible == 0){
                            if(numeros_posibles[0] == numero_posible){
                                posi = numeros_posibles[1];
                            }else{posi = numeros_posibles[0]}
                            sudoku[fila][columna] = posi;
                            estampados++;
                        }
                    }
                }
            }
        }
        estampados += colocar_numeros_posibles_en_las_celdas_y_resolver_posibles_unicos(true);
        estampados_acumulado = estampados;
    }
    return estampados_acumulado;
}

function buscando_solucion_probando_con_celdas_que_tienen_solo_dos_numeros_posibles(){
    var fi;
    var co;
    var salir;
    var solo_dos = [];
    var numeros_posibles = [];
    var hacer = true;
    while (hacer){
        hacer = false;
        solo_dos = selecciono_celdas_con_solo_dos_numeros_posibles()
        guardar_a_ori(); 
        //recorremos el array con las celdas de dos numeros posibles
        if(solo_dos.length > 0){
            for (let celda_tratada of solo_dos){
                numeros_posibles = [];
                fi = celda_tratada[0];
                co = celda_tratada[1];
                numeros_posibles.push(celda_tratada[2]);
                numeros_posibles.push(celda_tratada[3]);
                // recorremos los numeros posibles
                posicion = 0;
                for (let num of numeros_posibles){
                    sudoku[fi][co] = num;  
                    colocar_numeros_posibles_en_las_celdas_y_resolver_posibles_unicos(true);
                    procesos_algoritmos();
                    if (comprobar_valores_y_ceros_de_celdas_cumplan_normas_sudoku()){            
                        if(cantidad_valores_tiene_el_sudoku() == 81){
                            info = "---SUERTE---";
                            return true;
                        }
                        if(posicion == 0){
                            cero_ok = true;
                        }
                        if(posicion == 1){
                            uno_ok = true;
                        }
                    }else{
                        if(posicion == 0){
                            cero_ok = false;
                        }
                        if(posicion ==1){
                            uno_ok = false;
                        }
                    }
                    posicion++;
                    guardar_desde_ori()
                }
                if(cero_ok && uno_ok){
                    guardar_desde_ori();
                }else{
                    if (cero_ok){
                        sudoku[fi][co] = numeros_posibles[0];
                        colocar_numeros_posibles_en_las_celdas_y_resolver_posibles_unicos(true);
                        hacer = true;
                        break;
                    }
                    if(uno_ok){
                        sudoku[fi][co] = numeros_posibles[1];
                        colocar_numeros_posibles_en_las_celdas_y_resolver_posibles_unicos(true);
                        hacer = true;
                        break;
                    }
                }
            }
        }else{
            info = "--No se encuentran celdas con dos numeros posibles--";
            return false;
        }
    }
    return false;
}

function selecciono_celdas_con_solo_dos_numeros_posibles(){
    /*
    //devolvemos un array de arrays de todas las celdas que tienen dos numeros y solo dos posibles
    //en cada array de celda se incluye => fila,columna,primernumero posible, segundo numero posible
    */
    var dd;
    var posi = [];
    var solo_dos =[];
    var numeros_posibles = [];
    //Guardamos las celdas con solo dos numeros posibles en el array (solo_dos)
    // cada elemento del array contiene [fila,columna,primer_numero,segundo_numero]
    //solo_dos = [];
    for (let fila = 0; fila < 9; fila++){
        posi = numeros_posibles_que_hay_en_las_celdas_de_una_fila(fila)
        if(posi.length > 0){
            for (let x = 0; x < posi.length; x++){
                if (posi[x].length == 2){
                    numeros_posibles = posi[x];
                    dd = [fila,x,numeros_posibles[0],numeros_posibles[1]];
                    solo_dos.push(dd);
                }
            }
        }
    }
    return solo_dos;
}

function guardar_a_ori(){
    for (let fi = 0; fi  < 9; fi++){
        for (let co = 0; co < 9; co++){
            sudoku_ori[fi][co] = sudoku[fi][co];
            posibles_ori[fi][co] = posibles[fi][co];
        }
    }
    return;
}

function guardar_desde_ori(){
    for (let fi = 0; fi  < 9; fi++){
        for (let co = 0; co < 9; co++){
            sudoku[fi][co] = sudoku_ori[fi][co];
            posibles[fi][co] = posibles_ori[fi][co];
        }
    }
    return;
}

// comparamos dos arrays, para ver si son iguales
function comparo_dos_arrays(array1, array2){
    //array1 y array2-> arrays a comparar
    //devolvemos true si son iguales
    var narray1 = array1.length
    var narray2 = array2.length
    if (narray1 == narray2){
        var iguales = 0
        for (let x = 0; x < narray1; x++){
            if (array2.includes(array1[x])){
                iguales++
            }else{
                return false;
            }
        }
        if (iguales == narray1){
            return true;    
        }
    }
    return false;
}

/*
verificamos los valores que se visualizan del sudoku, teniendo encuenta:
.-solo verificamos las celdas donde se visualizan valores de 1 a 9
.-devolvemos un cero si encontramos algun valor que no es correcto con el resultado.
.-el numero de valores correctos encontrados (si son 81 nos indica que el sudoku esta resuelto)
*/
function verificar_sudoku(){
    var iid = 0;
    var num = 0;
    var cant =0;
    if(comprobar_valores_y_ceros_de_celdas_cumplan_normas_sudoku()){
        $("#comen").val("--- Las celdas son correctas ---");
        return true;
    }
    return false;
}

function generar_sudoku_con_mis_algorimos(){
    var nfi; var nco; var nva;
    var cant_bucle = 0;
    var cant = 0;
    var sacar = 0;
    var hacer = 10000;
    var ok = false;
    var valores_en_sudoku = 0;
    while (true){
        nfi = Math.round(Math.random()*8); nco = Math.round(Math.random()*8); nva = Math.round(Math.random()*9);
        if (sudoku[nfi][nco] == 0){
            if (comprobar_que_celda_cumpla_normas_sudoku(nfi, nco, nva)){
                if(comprobar_incoherencias_en_filas_al_querer_estampar_un_numero(nfi, nco, nva)){
                    if(comprobar_incoherencias_en_columnas_al_querer_estampar_un_numero(nfi, nco, nva)){
                        sudoku[nfi][nco] = nva;
                        colocar_numeros_posibles_en_las_celdas_y_resolver_posibles_unicos(false);
                        if(comprobar_valores_y_ceros_de_celdas_cumplan_normas_sudoku()){
                            guardar_a_ori();
                            valores_en_sudoku = cantidad_valores_tiene_el_sudoku();
                        }else{
                            guardar_desde_ori();   
                        }
                    }
                }
            }
        }
        if (valores_en_sudoku == celdas_iniciales ){ok = true; break;}
        if(cant_bucle++ > hacer){break;}
    }
    return ok; 
}

function poner_a_blancos_sudoku(){
    var iid;
    $('#entradas input[type=text]').each(function(){
        //$(this).show(); 
        $(this).val(' '); 
        $(this).removeAttr("disabled"); 
        $(this).removeAttr("readonly"); 
    });

    for (let y=0; y<9; y++){
        for (let x=0; x<9; x++){
            iid = (y * 9) + x;
            document.getElementById(iid).value = "";
            document.getElementById(iid).style.background = '#A9E7BE'; // '#fff563';
            sudoku[y][x] = 0;
            posibles[y][x] = [1,2,3,4,5,6,7,8,9];
        }    
    }
    return;
}

var id_hora;
var id_crono;

function inicio_hora(){
    id_hora = setInterval(escribeHora,1000);
}    

function inicio_crono(){
    $("#pausa").attr("disabled", false);
    $("#pausa").css('background', color_act);
    $("#reiniciar").attr("disabled", true);
    $("#reiniciar").css('background', color_des);
    $('#entradas input[type=text]').each(function(){
        $(this).show(); 
    });
    id_crono = setInterval(escribeCrono,1000);

}

function escribeHora(){
    // visualizamos la hora
    var fecha = new Date();
    fecha.toLocaleTimeString('es-ES') ; //da la hora en el formato español de 24 horas
    var ho = fecha.getHours();
    var mi = fecha.getMinutes();
    var se = fecha.getSeconds();
    if (ho<10) {ho= "0" + ho;}
    if (mi<10) {mi= "0" + mi;}
    if (se<10) {se= "0" + se;}
    document.getElementById("reloj").innerHTML = ho + ":" + mi + ":" + se;
}

function escribeCrono(){    
    // cronometro 
    s++;
    if (s<10) {s= "0" + s;}
    if (s == 60){
        m++; s=0;
        if (m<10) {m= "0" + m;} 
    }
    if (m == 60){
        h++; m=0;
        if (h<10) {h= "0" + h;}
    }
    $("#segundos").val(s);
    $("#minutos").val(m);
    $("#horas").val(h);
}

function para_crono(){
    $("#pausa").attr("disabled", true);
    $("#pausa").css('background', color_des);
    $("#reiniciar").attr("disabled", false);
    $("#reiniciar").css('background', color_act);
    $('#entradas input[type=text]').each(function(){
        $(this).hide(); 
    });
    clearInterval(id_crono);
}

function desabilitar_botones_crono(){
    //desabilitamos los botones del cronometro y paramos el crono
    $("#pausa").attr("disabled", true);
    $("#pausa").css('background', color_des);
    $("#reiniciar").attr("disabled", true);
    $("#reiniciar").css('background', color_des);
    clearInterval(id_crono);
}

/*
    detectamos los numeros posibles de una celda y lo devolvemos en un array
*/
function numeros_posibles_de_la_celda(fila,columna){ 
    numeros_posibles = [];
    if ($("#" + tcelda).val() == ""){
        //vemos que numeros hay en la fila
        let numeros_fila = numeros_que_hay_en_las_celdas_de_la_fila(fila);
        //vemos que numeros hay en la columna
        let numeros_columna = numeros_que_hay_en_las_celdas_de_la_columna(columna);
        //vemos que numeros hay en la zona
        let numeros_zona = numeros_que_hay_en_las_celdas_de_la_zona(fila, columna);
        // quitamos los elementos que esten repetidos
        let todos_los_numeros = numeros_fila.concat(numeros_columna, numeros_zona);
        let numeros_no_repetidos =  quitar_elementos_repetidos_de_array(todos_los_numeros);
        var numeros_posibles = [];
        //guardo los numeros del 1 al 9 que no esten incluidos en el array numeros_no_repetidos
        for (let num = 1; num < 10; num++){
            if (!numeros_no_repetidos.includes(num)){numeros_posibles.push(num)}
        }
        posibles[fila][columna] = numeros_posibles;
    }else{
        posibles[fila][columna] = [];
    }
    return numeros_posibles;
}