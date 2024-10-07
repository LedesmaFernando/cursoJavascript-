
const productos = [
    {id:11, nombre:"arroz", precio:1800, stock:1200},
    {id:12, nombre:"fideo", precio:1600, stock:2000},
    {id:13, nombre:"tomate",precio:1500, stock:200},
    {id:14, nombre:"queso", precio:10000, stock:500},
    {id:15, nombre:"yerba", precio:11000, stock:300}];
class Producto{
    constructor(id, nombre, precio, stock){
        this.id = parseInt(id);
        this.nombre = nombre.toLowerCase();
        this.precio = parseFloat(precio);
        this.stock = parseInt(stock);
    }
};


const guardarProductos = (clave, valor) => {
    localStorage.setItem(clave,JSON.stringify(valor));
};
const recuperarDatos = (clave) => {
    const listaGuardada = localStorage.getItem(clave);
    if (listaGuardada) {
        try {
            return JSON.parse(listaGuardada);
        } catch (error) {
            console.error('Error al parsear los datos desde localStorage:', error);
            return [];
        }
    }
    return [];
};

///----------------
const productosGuardados = recuperarDatos("lista_productos");
const productosActual = productosGuardados.length > 0 ? productosGuardados : productos.slice()

let resultado = document.getElementById("resultado");
///----------------

fetch(`https://dolarapi.com/v1/dolares`)
.then((response)=> response.json())
.then((data)=> { cotizaciones(data) });

function cotizaciones(data){
    console.log(data)

const oficial = document.getElementById("oficial");{}
oficial.innerHTML =`<p>${data[0].nombre}</p>
                    <p>Compra: $${data[0].compra}/ Venta: $${data[0].venta}</p>
                    `
const blue = document.getElementById("blue");
blue.innerHTML = `  <p>${data[1].nombre}</p>
                    <p>Compra: $${data[1].compra}/ Venta :$${data[1].venta}</p>
                    `
const contadoLiqui = document.getElementById("contado-liqui");
contadoLiqui.innerHTML = `  <p>${data[3].nombre}</p>
                            <p>Compra :$${data[3].compra}/ Venta:$${data[3].venta}</p>
                            `
const mayorista = document.getElementById("mayorista");
mayorista.innerHTML =`<p>${data[4].nombre}</p>
            <p>Compra: $${data[4].compra}/ Venta :$${data[4].venta}</p>
            `
}
function mostrarStock(){
    let tabla = `<table class="tabla">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Stock</th>
                        </tr>
                    </thead>
                    <tbody>`;
    productosActual.forEach(producto => {
        tabla += `<tr>
                    <td>${producto.id}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.precio}</td>
                    <td>${producto.stock}</td>
                    </tr>`;
    });
    tabla += `</tbody>
                    </table>`;
    resultado.innerHTML = `<div>${tabla}</div>`;
}
function mostrarMenuAgregar(){
    resultado.innerHTML =`
        <div class="nuevo-producto">
            <form id="form-agregar-producto">
            <h4>Ingrese Nuevo Producto</h4>
            <input type="number" class="entrada" name="id" id="id" placeholder="Ingrese ID">
            <input type="text" class="entrada" name="nombre" id="nombre" placeholder="Ingrese Nombre">
            <input type="number" class="entrada" name="precio" id="precio" placeholder="Ingrese Precio">
            <input type="number" class="entrada" name="stock" id="stock" placeholder="Ingrese Stock">
            <input type="submit" class="entrada" id="boton-agregar-producto" value="Agregar">
            </form>
        </div>`
        let formulario = document.getElementById("form-agregar-producto");
        formulario.addEventListener("submit", (event) => { 
            event.preventDefault(); 
            agregarProducto(); 
        });
        
}
function agregarProducto(){
    let id = parseInt(document.getElementById("id").value.trim());
    let nombre = document.getElementById("nombre").value.trim();
    let precio = parseFloat(document.getElementById("precio").value.trim());
    let stock = parseInt(document.getElementById("stock").value.trim());

    if(id === ""|| nombre === "" || precio === "" || stock === ""){
        alert("debe completar todos los campos");
    }else if(validarId(id) && validarPrecio(precio) && validarStock(stock)){
        const producto1 = new Producto(id, nombre, precio, stock);
        productosActual.push(producto1);
        Swal.fire({
            title: 'Hecho',
            icon: 'success',
            text: "Producto agregado"
        }).then(()=>{
            return  Swal.fire({
                        title: '¿Desea continuar?',
                        text: "¿Quiere agregar otro producto?",
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sí, continuar',
                        cancelButtonText: 'No, cancelar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            console.log('¡Confirmado!');
                            document.getElementById("id").value = '';
                            document.getElementById("nombre").value = '';
                            document.getElementById("precio").value = '';
                            document.getElementById("stock").value = '';
                        } else {
                        mostrarStock();
                        guardarProductos("lista_productos", productosActual);
                        }
                    });
        });
        
    }
    
}
function validarId(id){
    if(id ==="" || isNaN(id) || id <= 0 ){
        Swal.fire({
            title: 'Error',
            icon: 'error',
            text: "Id invalida"
        })
        return false;
    }else{
        let existe = productosActual.some(producto => producto.id === id);
        if(existe){
            Swal.fire({
                title: 'Error',
                icon: 'error',
                text: "Id ya existe"
            })
            return false;
            
        }else{
            return true
        }
    }
}
function validarPrecio(precio) {
    if(isNaN(precio) || parseFloat(precio) <= 0) {
        Swal.fire({
            title: 'Error',
            icon: 'error',
            text: "Precio invalido"
        })
        return false;
    }else{
        return true;
    }
}
function validarStock(stock) {
    if (isNaN(stock) || parseInt(stock) < 0) {
        Swal.fire({
        title: 'Error',
        icon: 'error',
        text: "Stock invalido"
        })
        return false;
    }else{
        return true;
    }
}
function buscarProductoMenu(){
    resultado.innerHTML = `
        <div class="nuevo-producto">
            <form id="form-buscar-producto">
            <h4>Buscar Producto por "Id"</h4>
            <input type="number" class="entrada" name="id" id="id" placeholder="Ingrese ID">
            <input type="submit" class="entrada" id="boton-buscar-producto" value="Buscar">
            </form>
            <div class="producto" id="producto"></div>
            
        </div>` 
        let formulario = document.getElementById("form-buscar-producto");
        formulario.addEventListener("submit", (event) => { 
            event.preventDefault(); 
            buscarProducto(); 
        });    
}
function buscarProducto(){
    let idBuscada = parseInt(document.getElementById("id").value.trim());
    let existe = productosActual.some((producto) => producto.id === idBuscada);
    if(existe){
        let indice = productosActual.findIndex(producto => producto.id === idBuscada);
        const productoBuscado = productosActual[indice];
        let mostrarProducto = document.getElementById("producto");
        mostrarProducto.innerHTML = `
            <h4>Producto Buscado:</h4> 
            <table class="tabla">
                <tr>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Stock</th>
                </tr>
                <tr>
                    <td>${productoBuscado.id}</td>
                    <td>${productoBuscado.nombre}</td>
                    <td>${productoBuscado.precio}</td>
                    <td>${productoBuscado.stock}</td>
                </tr>
            </table>`;
        }else{
            Swal.fire({
            title: 'Error',
            icon: 'error',
            text: "Producto no existe"
            })
        }

}
function cambiarPrecioMenu(){
    resultado.innerHTML = `
        <div class="nuevo-producto">
            <form id="form-precio-producto">
            <h4>Cambiar el precio</h4>
            <input type="number" class="entrada" name="id" id="id" placeholder="Ingrese ID">
            <input type="number" class="entrada" name="nuevo-precio" id="nuevo-precio" placeholder="Nuevo precio">
            <input type="submit" class="entrada" id="boton-precio-cambiar" value="Cambiar">
            </form>
        </div>` ;
    let formulario = document.getElementById("form-precio-producto");
    formulario.addEventListener("submit", (event) => { 
        event.preventDefault(); 
        cambiarPrecio(); 
        });
}
function cambiarPrecio(){
    let idBuscada = parseInt(document.getElementById("id").value.trim());
    let nuevoPrecio = parseFloat(document.getElementById("nuevo-precio").value.trim());
    let existe = productosActual.some((producto) => producto.id === idBuscada);
    if(existe && validarPrecio(nuevoPrecio)){
        let indice = productosActual.findIndex(producto => producto.id === idBuscada);
        productosActual[indice].precio = nuevoPrecio;
        Toastify({
            text: "Precio modificado",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            }).showToast();
        guardarProductos("lista_productos", productosActual);
    }
}
function cambiarStockMenu(){
    resultado.innerHTML = `
        <div class="nuevo-producto">
            <form id="form-stock-producto">
            <h4>Cambiar el Stock</h4>
            <input type="number" class="entrada" name="id" id="id" placeholder="Ingrese ID">
            <input type="number" class="entrada" name="nuevo-precio" id="nuevo-stock" placeholder="Nuevo Stock">
            <input type="submit" class="entrada" id="boton-stock-cambiar" value="Cambiar">
            </form>
        </div>` ;
    let formulario = document.getElementById("form-stock-producto");
    formulario.addEventListener("submit", (event) => { 
        event.preventDefault(); 
        cambiarStock(); 
        });
}
function cambiarStock(){
    let idBuscada = parseInt(document.getElementById("id").value.trim());
    let nuevoStock = parseFloat(document.getElementById("nuevo-stock").value.trim());
    let existe = productosActual.some((producto) => producto.id === idBuscada);
    if(existe && validarStock(nuevoStock)){
        let indice = productosActual.findIndex(producto => producto.id === idBuscada);
        productosActual[indice].stock = nuevoStock;
        Toastify({
            text: "Stock modificado",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            }).showToast();
        guardarProductos("lista_productos", productosActual);
    }
}
function eliminarMenu(){
    resultado.innerHTML = `
        <div class="nuevo-producto">
            <form id="form-eliminar-producto">
            <h4>Eliminar un producto</h4>
            <input type="number" class="entrada" name="id" id="id" placeholder="Ingrese ID">
            <input type="submit" class="entrada" id="boton-eliminar-producto" value="Eiminar">
            </form>
        </div>` ;
    let formulario = document.getElementById("form-eliminar-producto");
    formulario.addEventListener("submit", (event) => { 
            event.preventDefault(); 
            eliminarProducto(); 
        });
}
function eliminarProducto(){
    let idBuscada = parseInt(document.getElementById("id").value.trim());
    let existe = productosActual.some((producto) => producto.id === idBuscada);
    if(existe){
        let indice = productosActual.findIndex(producto => producto.id === idBuscada);
        productosActual.splice(indice, 1);
        Toastify({
            text: "Producto Eliminado",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            }).showToast();
        guardarProductos("lista_productos", productosActual);
    }else{
        Toastify({
            text: "El producto no existe",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            }).showToast();
    }
    
}





let botonVerStock = document.getElementById("boton-ver");
botonVerStock.addEventListener("click", ()=>{ mostrarStock() });

let botonAgregarMenu = document.getElementById("boton-agregar");
botonAgregarMenu.addEventListener("click", () => { mostrarMenuAgregar() });

let botonBuscarMenu = document.getElementById("boton-buscar");
botonBuscarMenu.addEventListener("click",()=>{ buscarProductoMenu() });

let botonCambiarPrecioMenu = document.getElementById("boton-precio");
botonCambiarPrecioMenu.addEventListener("click",()=>{ cambiarPrecioMenu() });

let botonCambiarStockMenu = document.getElementById("boton-stock");
botonCambiarStockMenu.addEventListener("click",()=>{ cambiarStockMenu() });

let botonEliminarMenu = document.getElementById("boton-eliminar");
botonEliminarMenu.addEventListener("click", ()=>{ eliminarMenu() });

setTimeout(()=>{
    Swal.fire({
        title: 'Hola!',
        icon: 'info',
        text: "Recuerda revisar las cotizaciones del dia!",
        showConfirmButton: false,
        timer: 3000
    })
}, 2000);

