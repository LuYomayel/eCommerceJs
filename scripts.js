let productos = document.getElementById("listaProductos");
let stockProductos = [];
let carrito;
let buscar = document.getElementById('buscador')


class Producto {
    constructor(id, nombre, precio, imagen){
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.imagen = imagen;
        this.cantidad = 0;
    }
}


//Verifico si hay items en el storage y sino cargo el carrito vacio
if(sessionStorage.getItem('carrito')){
    carrito = JSON.parse(sessionStorage.getItem('carrito'))
} else{
    carrito = [];
}

$( () => {
    //Una vez que cargue la pagina voy a cargar de la API de ML las publicaciones de 30 productos

    $.get('https://api.mercadolibre.com/sites/MLA/search?category=MLA1144&limit=30', function (data) {
        //Por cada publicacion, instancio la clase producto a la que le cargo los datos de la API y, luego,
        // agrego ese producto al array de stockProductos
        data.results.forEach(element => {
            let url = `https://http2.mlstatic.com/D_NQ_NP_2X_${element.thumbnail_id}-F.webp`
            stockProductos.push(
            new Producto(element.id, element.title,element.price,url)
            )
            
        });
        
        //Uso la funcion de mostrarProductos donde agrego al DOM este array recien cargado
        mostrarProductos(stockProductos);

        //agrego al localStorage el array de productos
        localStorage.setItem('stockProductos',JSON.stringify(stockProductos))
    })
    
})




function mostrarProductos(array){
    //En caso de tener contenido en el id listaProductos, lo vacio para luego llenarlo.
    $('#listaProductos').empty();

    //Por cada objeto del array creo una card con boostrap y jQuery
    for (const producto of array) {
         $('#listaProductos').append(`
            <div class="card border-secondary mb-3 me-2" style="max-width: 20rem;">
                        <img max-heigth="100%" src=${producto.imagen}>   
                        <div class="card-body">
                            <h4 class="card-title">${producto.nombre}</h4>
                            <p class="card-text">$${producto.precio}</p>
                            <button type="button" class="btn btn-primary" id=${producto.id}>Agregar al carrito</button>
                        </div>
                        
            `)
    }

    // A cada elemento del array le agrego el boton "Agregar al carrito"
    array.forEach( (producto, indice) =>{
        document.getElementById(`${producto.id}`).addEventListener('click', () => {
            let repetido = carrito.find(prodR => prodR.id == producto.id);
            
            //En caso de que el producto seleccionado ya esté en el carrito, le sumo uno a la cantidad
            if(repetido){
                repetido.cantidad += 1;
                sessionStorage.setItem('carrito', JSON.stringify(carrito));
            } else{
            producto.cantidad = 1;
            carrito.push(producto);
            sessionStorage.setItem('carrito', JSON.stringify(carrito));
            }
            console.log(carrito);
        })
        
    })
    
}


// A la barra de busqueda ubicada en el nav le agrego la funcion de buscar entre los elementos del array stockProductos
buscar.addEventListener('click', (e) => {
    e.preventDefault();
    let nuevoArray = [];
    if(document.getElementById('lblBuscar')){

        let palabraBuscada = document.getElementById('lblBuscar').value;
        
        stockProductos.forEach(prod  => {
            if(prod.nombre.includes(palabraBuscada) ){
                nuevoArray.push(prod);
            }
        })

    }else{
        nuevoArray = carrito;
    }
    mostrarProductos(nuevoArray);
})

     

