let contenedor = document.getElementById('contenedor')
let carrito = [];



function agregarCarrito(){

    // Si tengo algo en el carrito, muestro una tabla con los productos sino muestro un mensaje
    if(sessionStorage.getItem('carrito')){
        tituloTabla();
        actualizarCarrito();
        
        
        let table = document.getElementById('tablaCarrito');

        // Con un for...of... recorro el carrito para mostrar cada producto en la tabla
        for(let prod of carrito){
            if(prod != undefined){
                let card = document.createElement('tr');
                
                
                card.innerHTML =    `
                <th scope="row">${prod.nombre}</th>
                <td>$${prod.precio}</td>
                
                <td id="cant${prod.id}"><button type="button" class="btn" id="restar${prod.id}"><i class="fas fa-minus fa-xs "  style="color:red;"></i></button>&nbsp&nbsp${prod.cantidad}&nbsp&nbsp<button type="button" class="btn" id="sumar${prod.id}"><i class="fas fa-plus fa-xs" style="color:green;"></i></button></td>
                <td><button type="button" class="btn" id="eliminar${prod.id}"><i class="fas fa-minus-circle" style="color:red;"></button></i></td>
                `;
                
                


                table.lastChild.appendChild(card);

                botonEliminar(prod.id);

                botonAgregar(prod.id);

                botonRestar(prod.id);
            }
        }
        mostrarTotal();

    } else{
        $('#contenedor').append('<h3 class="danger">Carrito vacio.</h3>')
    }
}

//Crea el head de la tabla del carrito
function tituloTabla(){
    let table = document.createElement('table');
    table.className = 'table table-hover';
    table.id = 'tablaCarrito';
    contenedor.append(table);
    let thead = document.createElement('thead');
    table.appendChild(thead);
    let tr = document.createElement('tr');
    thead.appendChild(tr);

    let th1=document.createElement('th');
    th1.scope = 'col';
    th1.textContent = 'Nombre';
    let th2=document.createElement('th');
    th2.scope = 'col';
    th2.textContent = 'Precio';
    let th3=document.createElement('th');
    th3.scope = 'col';
    th3.textContent = 'Cantidad';
    let th4=document.createElement('th');
    th4.scope = 'col';
    th4.textContent = 'Eliminar';
    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);
    tr.appendChild(th4);
    table.appendChild(document.createElement('tbody'));
}

//Agrego los productos al array carrito desde el sessionStorage
function actualizarCarrito(){
    let arrayStorage = JSON.parse(sessionStorage.getItem('carrito'))
    if(arrayStorage){
        arrayStorage.forEach(el => {
            carrito.push(el)
        });
    }
}


function mostrarTotal(){
    // Creo un div para aplicar boostrap
    let div = document.createElement('div');
    div.className = 'd-flex justify-content-between';
    contenedor.appendChild(div);

    // Boton para finalizar la compra que va a generar una ventana emergente
    let btnFinalizar = document.createElement('button');
    btnFinalizar.className = 'btn btn-primary';
    btnFinalizar.textContent = 'Finalizar compra';
    div.append(btnFinalizar)

    // Agrego al DOM el total del carrito
    let totalCarrito = 0;
    let total = document.createElement('h3');
    total.id = 'totalCarrito';
    total.className = 'justify-content-end';

    for(let prod of carrito){
        
        totalCarrito += prod.precio * prod.cantidad;
    }

    total.innerText = `Total: $${totalCarrito}`;
    div.append(total);

    // Agrego al boton la funcion de crear la ventana emergente (cartel)
    btnFinalizar.addEventListener('click', () => {
        let cartel = document.createElement('div');
        cartel.id = 'window-notice';
        cartel.className = 'window-notice';
        cartel.innerHTML =  `<div class="content">
                                <div class="" style="max-width: 1000px;">
                                        <div class="d-flex justify-content-end">
                                            <i id="btnCerrar" class="fas fa-times-circle btn" style="color:red;"></i>
                                        </div>
                                    <div class="content-text" id="ventanaEmergente">
                                        
                                    </div>
                                </div>
                            </div>`;

        
        
        document.body.appendChild(cartel);

        // A la ventana emergente le agrego un boton para poder cerrar la ventana
        let btnCerrarVentana = document.getElementById('btnCerrar');
        btnCerrarVentana.addEventListener('click', () => {
            cartel.remove();
        })


        let ventanaEmergente = document.getElementById('ventanaEmergente');
        let productos = document.createElement('div')

        // A la ventana emergente le agrego los productos del carrito
        for(let producto of carrito){
            productos.innerHTML += `
                                    <div class="row g-0">
                                        <div class="col-md-1">
                                            <img src="${producto.imagen}" class="img-fluid rounded-start" alt="...">
                                        </div>
                                        <div class="col-md-10">
                                            <div class="card-body">
                                                <h5 class="card-title">${producto.nombre}</h5>
                                                <div class="card-text row">
                                                    <h6 class="col-4">Cantidad: ${producto.cantidad}</h6>
                                                    <h6 class="col">Total: $${producto.precio * producto.cantidad}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
            `
        }
        ventanaEmergente.appendChild(productos);
        let div1 = document.createElement('div');
        div1.className = 'd-flex justify-content-between';
        ventanaEmergente.appendChild(div1)

        // Tambien le agrego un boton para finalizar la compra y el total del carro 
        let btnComprar = document.createElement('button');
        btnComprar.textContent = 'Comprar';
        
        btnComprar.className = 'btn btn-success';
        div1.appendChild(btnComprar);

        let totalHtml = document.getElementById('totalCarrito');
        let total = document.createElement('h2');
        total.textContent = `${totalHtml.textContent}`;
        div1.appendChild(total);

        // Al boton agregado le doy la funcion de finalizar la compra y vaciar el carrito
        btnComprar.addEventListener('click', () => {
            
            console.log(cartel);
            cartel.remove();
            carrito = [];
            sessionStorage.setItem('carrito', carrito);
            contenedor.remove();
            contenedor.innerHTML = '<h3>Compra finalizada con éxito!</h3>'
            document.body.appendChild(contenedor)
        })
    })
}

// Funcion para ir actualizando el total del carrito mostrado en el html a medida que se generan cambios en la tabla
function actualizarTotal(){
    if(document.getElementById('totalCarrito')){
        let totalCarrito = 0;
        let total = document.getElementById('totalCarrito')
            for(let prod of carrito){
        
                totalCarrito += prod.precio * prod.cantidad;
            }
        
            total.innerText = `Total: $${totalCarrito}`;
        
    }
    
}

// Boton para eliminar el producto seleccionado de la tabla y del carrito
function botonEliminar(id){
    
    document.getElementById(`eliminar${id}`).addEventListener('click', () => {
        
        let nuevoCarro = carrito.filter(p => p.id != id);
        carrito = nuevoCarro;
        sessionStorage.setItem('carrito', JSON.stringify(carrito))
        

        let html = document.getElementById(`eliminar${id}`)
        html.parentElement.parentElement.remove()
        actualizarTotal();
    })
    
}

// Funcion para restar 1 a la cantidad del producto seleccionado
function botonRestar(id){
    document.getElementById(`restar${id}`).addEventListener('click', () => {
        let producto = carrito.find(p => p.id == id);
        console.log('hola')
        producto.cantidad--;
        let nuevoCarro = carrito.filter(p => p.id != id);
        
        
        if(producto.cantidad == 0){
            carrito = nuevoCarro;
            sessionStorage.setItem('carrito', JSON.stringify(carrito))
            let html = document.getElementById(`eliminar${id}`)
            console.log(html)
            html.parentElement.parentElement.remove()
        }else{
            nuevoCarro.push(producto);
            carrito = nuevoCarro;
            sessionStorage.setItem('carrito', JSON.stringify(carrito))   

            let cantidad = document.getElementById(`cant${id}`)
            
            cantidad.innerHTML = `<td id="cant${id}"><button type="button" class="btn" id="restar${id}"><i class="fas fa-minus fa-xs "  style="color:red;"></i></button>&nbsp&nbsp${producto.cantidad}&nbsp&nbsp<button type="button" class="btn" id="sumar${id}"><i class="fas fa-plus fa-xs" style="color:green;"></i></button></td>`;
        
        }

        
        actualizarTotal();
        botonRestar(id);
        botonAgregar(id);
    })
    
}

// Funcion para sumar uno a la cantidad del producto seleccionado
function botonAgregar(id){
    document.getElementById(`sumar${id}`).addEventListener('click', () => {
        let producto = carrito.find(p => p.id == id);
        producto.cantidad++;
        let nuevoCarro = carrito.filter(p => p.id != id);
        nuevoCarro.push(producto);
        carrito = nuevoCarro;
        sessionStorage.setItem('carrito', JSON.stringify(carrito))
        let cantidad = document.getElementById(`cant${id}`)
        
        cantidad.innerHTML = `<td id="cant${id}"><button type="button" class="btn" id="restar${id}"><i class="fas fa-minus fa-xs "  style="color:red;"></i></button>&nbsp&nbsp${producto.cantidad}&nbsp&nbsp<button type="button" class="btn" id="sumar${id}"><i class="fas fa-plus fa-xs" style="color:green;"></i></button></td>`;
        
        actualizarTotal();
        botonAgregar(id);
        botonRestar(id);
    })
}
agregarCarrito();