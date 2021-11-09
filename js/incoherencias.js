/*
dado un numero inicial para una celda, nos aseguraremos que puede ir en esa celda si cumple las tres 
condiciones siguientes:

    .- en las celdas de la fila de la celda donde queremos poner el numero no existe ya un numero igual.
    .- en las celdas de la columna de la celda donde queremos poner el numero no existe ya un numero igual..
    .- en las celdas de la zona de la celda donde queremos poner el numero no existe ya un numero igual.

tambien comprobaremos antes de estamparlo que cumpla estos otras dos condiciones:
    .- que en las dos otras de las zonas a la que pertenece la fila de la celda donde queremos estampar el numero,
    podamos estampar el numero en alguna de las celdas, si no esta estampado ya.

    .- que en las dos otras de las zonas a la que pertenece la columna de la celda donde queremos estampar el numero,
    podamos estampar el numero en alguna de las celdas, si no esta estampado ya.



PROCESO PARA CONTROLAR QUE NO TENGA INCOHERENCIAS LA ESTAMPACION DE UN NUMERO EN UNA CELDA

datos:
zonas_de_la_fila:  (es un array con de tres arrays con la fila y columna de inicio de cada zona)
zona_celda_tratada:  (tenemos un array con la fila y columna de inicio de la zona)
dos_zonas: es una array con dos array que donde cada uno nos indica la fila y columna de inicio de la zona)
fila_inicio_zona:   
fila_excluida: (es la fila que ocupa la celda donde queremos estampar el numero)
columna_inicio_zona:
numero _posible:   (es el numero que intentamos estampar)
dos_filas:(array con las dos filas que debemos que controlar)
numeros_estampados las dos zonas:
    guardaremos un array con dos arrays donde en cada uno guardaremos los numeros de cada una de las dos filas a observar

//comprobamos la primera fila
si esta estampado en z1f1 y en z2f1
    error
si esta estampdo en z1f2 y en z2f2
    error
si esta estampado en z1f1 y en z1f2
    error
si esta estampado en z2f1 y en z2f2
    error

si esta estampado en z1f1 
    es_posible
sino
    si esta estampado en z1f2
        es_posible
    sino
        si esta como posible en z1f1 y no esta como posible en z1f2
            en z2 deberia estar solo como posible en z2f2
        si esta como posible en z1f2 y no esta como posible en z1f1
            en z2 deberia estar solo como posible en z2f1
        si esta como posible en z1f1 y z1f2 
            en z2 podra estar como posible en z2f1 o z2f2

        comprobamos si el numero a estampar esta com posible en cualquiera de las celdas de las dos filas de la zona
finsi


si esta estampado en z2f1 
    es posible
sino
    si esta estampado en z2f2
        es_posible
    sino
        

        comprobamos si el numero a estampar esta como posible en cualquiera de las celdas de las dos filas de la zona
finsi
*/

function comprobar_incoherencias_en_filas_al_querer_estampar_un_numero(ffi, cco, va){
    var zona_celda_tratada  = determinar_zona_de_una_celda(ffi, cco);
    var zonas_de_la_fil;
    var fila_inicio_zona    = zona_celda_tratada[0];
    var columna_inicio_zona = zona_celda_tratada[1];
    var fila_excluida = ffi;
    var dos_filas = [];
    var dos_zonas = [];
    var numeros;
    var zo; 
    var pp; var fi; var fil;

    // detectamos las zonas 
    fil = zona_celda_tratada[0];
    if (fil < 3){
        zonas_de_la_fila = [[fil,0],[fil,3],[fil,6]];  
    }else if (fil < 6){
        zonas_de_la_fila = [[fil,0],[fil,3],[fil,6]];  
    }else if (fil < 9){
        zonas_de_la_fila = [[fil,0],[fil,3],[fil,6]];
    }
    // Hallamos las filas a tratar
    var filas_a_tratar = [];
    for (let y = zona_celda_tratada[0]; y <= zona_celda_tratada[0] + 2; y++){
        if (y != fila_excluida){
            dos_filas.push(y); 
        }  
    }
    //hallamos las zonas a tratar
    var zonas_a_tratar = [];
    for ( let zona of zonas_de_la_fila){
        if (zona[0] != zona_celda_tratada[0] || zona[1] != zona_celda_tratada[1]){
            dos_zonas.push(zona);
            }
    }
    // guardamos los numeros estampados por filas que hay en las dos zonas a tratar
    
    var nz1f1 = [];
    var nz1f2 = [];
    var nz2f1 = [];
    var nz2f2 = [];
    pp = [];
    zo = 0;
    for (let zona of dos_zonas){
        fi = 0;
        for (let fila of dos_filas ){
            numeros = [];
            for (let x = zona[1]; x <= zona[1] + 2; x++){
                pp = sudoku[fila][x];
                if (pp != 0){numeros.push(pp);}
            }
            if (zo == 0){
                if (fi == 0){
                    nz1f1 = numeros;
                    //nz1f1.push(numeros);
                }else{
                    nz1f2 = numeros;
                    //nz1f2.push(numeros);
                }
            }else{
                if (fi == 0){
                    nz2f1 = numeros;
                    //nz2f1.push(numeros);
                }else{
                    nz2f2 = numeros;
                    //nz2f2.push(numeros);
                }
            }
            fi++;
        }
        zo++;
    }
    // guardamos los numeros posibles por filas que hay en las dos zonas a tratar
    var pz1f1 = [];
    var pz1f2 = [];
    var pz2f1 = [];
    var pz2f2 = [];
    pp = [];
    zo = 0;
    for (let zona of dos_zonas){
        fi = 0;
        for (let fila of dos_filas ){
            numeros = [];
            for (let x = zona[1]; x <= zona[1] + 2; x++){
                pp = posibles[fila][x];
                if (pp.length > 0){numeros.push(pp);}
            }
            if (zo == 0){
                if (fi == 0){
                    pz1f1 = numeros;
                    //pz1f1.push(numeros);
                }else{
                    pz1f2 = numeros;
                    //pz1f2.push(numeros);
                }
            }else{
                if (fi == 0){
                    pz2f1 = numeros;
                    //pz2f1.push(numeros);
                }else{
                    pz2f2 = numeros;
                    //pz2f2.push(numeros);
                }
            }
            fi++;
        }
        zo++;
    }
    var es_posible = 0;
    if (nz1f1.includes(va) && nz2f1.includes(va)){
        info = "tenemos alguna incoherencia con los numeros estampados en las zonas 1 o 2 fila 1";
        return false;
    } 
    if (nz1f2.includes(va) && nz2f2.includes(va)){
        info = "tenemos alguna incoherencia con los numeros estampados en las zonas 1 o 2 fila 2"; 
        return false;
    } 
    if (nz1f1.includes(va) && nz1f2.includes(va)){
        info = "tenemos alguna incoherencia con los numeros estampados en las zonas 1 fila 1 y/o 2";    
        return false;
    } 
    if (nz2f1.includes(va) && nz2f2.includes(va)){
        info = "tenemos alguna incoherencia con los numeros estampados en las zonas 2 fila 1 y/o 2";
        return false;    
    }  
    //la primera zona
    if (nz1f1.includes(va)){
        es_posible++;
    }else{
        if (nz1f2.includes(va)){ 
            es_posible++;
        }else{
            for (let posi of pz1f1){
                if (posi.includes(va)){
                    es_posible++;
                    break;
                }
            }
            if (es_posible == 0){
                for (let posi of pz1f2){
                    if (posi.includes(va)){
                        es_posible++;
                        break;
                    }
                }
            }
        }
    }
    // la segunda zona 
    if (nz2f1.includes(va)){
        es_posible++;
    }else{
        if (nz2f2.includes(va)){ 
            es_posible++;
        }else{
            for (let posi of pz2f1){
                if (posi.includes(va)){
                    es_posible++;
                    break;
                }
            }
            if (es_posible == 1){            
                for (let posi of pz2f2){
                    if (posi.includes(va)){
                        es_posible++;
                        break;
                    }
                }
            }
        }
    }
    if (es_posible == 2){
        //console.log("podemos estampar el numero->" + va + " en la fila->" + ffi + " columna->" + cco);
        return true;
    }
    return false;
}

function comprobar_incoherencias_en_columnas_al_querer_estampar_un_numero(ffi, cco, va){
    var zona_celda_tratada  = determinar_zona_de_una_celda(ffi, cco);
    var zonas_de_la_columna;
    var fila_inicio_zona    = zona_celda_tratada[0];
    var columna_inicio_zona = zona_celda_tratada[1];
    var columna_excluida = ffi;
    var dos_columnas = [];
    var dos_zonas = [];
    var numeros;
    var zo; 
    var pp; var co; var col;

    // detectamos las zonas 
    col = zona_celda_tratada[0];
    if (col < 3){
        zonas_de_la_columna = [[0,col],[3,col],[6,col]];  
    }else if (col < 6){
        zonas_de_la_columna = [[0,col],[3,col],[6,col]];  
    }else if (col < 9){
        zonas_de_la_columna = [[0,col],[3,col],[6,col]];
    }
    // Hallamos las columnas a tratar
    var columnas_a_tratar = [];
    for (let x = zona_celda_tratada[1]; x <= zona_celda_tratada[1] + 2; x++){
        if (x != columna_excluida){
            dos_columnas.push(x); 
        }  
    }
    //hallamos las zonas a tratar
    var zonas_a_tratar = [];
    for ( let zona of zonas_de_la_fila){
        if (zona[0] != zona_celda_tratada[0] || zona[1] != zona_celda_tratada[1]){
            dos_zonas.push(zona);
            }
    }
    // guardamos los numeros estampados por columnas que hay en las dos zonas a tratar
    
    var nz1c1 = [];
    var nz1c2 = [];
    var nz2c1 = [];
    var nz2c2 = [];
    pp = [];
    zo = 0;
    for (let zona of dos_zonas){
        co = 0;
        for (let columna of dos_columnas ){
            numeros = [];
            for (let y = zona[1]; y <= zona[1] + 2; y++){
                pp = sudoku[y][columna];
                if (pp != 0){numeros.push(pp);}
            }
            if (zo == 0){
                if (co == 0){
                    nz1c1 = numeros;
                    //nz1f1.push(numeros);
                }else{
                    nz1c2 = numeros;
                    //nz1f2.push(numeros);
                }
            }else{
                if (co == 0){
                    nz2c1 = numeros;
                    //nz2f1.push(numeros);
                }else{
                    nz2c2 = numeros;
                    //nz2f2.push(numeros);
                }
            }
            co++;
        }
        zo++;
    }
    // guardamos los numeros posibles por filas que hay en las dos zonas a tratar
    var pz1c1 = [];
    var pz1c2 = [];
    var pz2c1 = [];
    var pz2c2 = [];
    pp = [];
    zo = 0;
    for (let zona of dos_zonas){
        co = 0;
        for (let columna of dos_columnas ){
            numeros = [];
            for (let y = zona[1]; y <= zona[1] + 2; y++){
                pp = posibles[y][columna];
                if (pp.length > 0 ){numeros.push(pp);}
            }
            if (zo == 0){
                if (co == 0){
                    pz1c1 = numeros;
                    //pz1f1.push(numeros);
                }else{
                    pz1c2 = numeros;
                    //pz1f2.push(numeros);
                }
            }else{
                if (co == 0){
                    pz2c1 = numeros;
                    //pz2f1.push(numeros);
                }else{
                    pz2c2 = numeros;
                    //pz2f2.push(numeros);
                }
            }
            co++;
        }
        zo++;
    }
    var es_posible = 0;
    if (nz1c1.includes(va) && nz2c1.includes(va)){
        info = "tenemos alguna incoherencia con los numeros estampados en las zonas 1 o 2 fila 1";
        return false;
    } 
    if (nz1c2.includes(va) && nz2c2.includes(va)){
        info = "tenemos alguna incoherencia con los numeros estampados en las zonas 1 o 2 fila 2"; 
        return false;
    } 
    if (nz1c1.includes(va) && nz1c2.includes(va)){
        info = "tenemos alguna incoherencia con los numeros estampados en las zonas 1 fila 1 y/o 2";    
        return false;
    } 
    if (nz2c1.includes(va) && nz2c2.includes(va)){
        info = "tenemos alguna incoherencia con los numeros estampados en las zonas 2 fila 1 y/o 2";
        return false;    
    }  
    //la primera zona
    if (nz1c1.includes(va)){
        es_posible++;
    }else{
        if (nz1c2.includes(va)){ 
            es_posible++;
        }else{
            for (let posi of pz1c1){
                if (posi.includes(va)){
                    es_posible++;
                    break;
                }
            }
            if (es_posible == 0){
                for (let posi of pz1c2){
                    if (posi.includes(va)){
                        es_posible++;
                        break;
                    }
                }
            }
        }
    }
    // la segunda zona 
    if (nz2c1.includes(va)){
        es_posible++;
    }else{
        if (nz2c2.includes(va)){ 
            es_posible++;
        }else{
            for (let posi of pz2c1){
                if (posi.includes(va)){
                    es_posible++;
                    break;
                }
            }
            if (es_posible == 1){            
                for (let posi of pz2c2){
                    if (posi.includes(va)){
                        es_posible++;
                        break;
                    }
                }
            }
        }
    }
    if (es_posible == 2){
        //console.log("podemos estampar el numero->" + va + " en la fila->" + ffi + " columna->" + cco);
        return true;
    }
    return false;
}