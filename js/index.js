import {Auto} from "./auto.js";
import {leer, escribir, limpiar} from "./localStorage-delay.js";
document.addEventListener("DOMContentLoaded", onInit); // importante no poner paren

const btnCargarAnuncio = document.getElementById("save-data");
const btnGuardar = document.getElementById("modify-cell");
const btnEliminar = document.getElementById("delete-cell");
const btnCancelar = document.getElementById("cancel-cell");

const items = [];
const KEY_STORAGE = "Autos";
const formulario = document.getElementById("form-anuncio");

function onInit(){
    loadItems();
    escuchandoSubmitFormulario();
    escuchandoClickTabla();
    escuchandoBtnDeleteAll();
    escucharBotonesGuardarAndEliminar();
    escuchandoBtnCancelar();
}

async function loadItems()
{
    inyectarSpinner();
    let objects = await leer(KEY_STORAGE) || [];
    objects.forEach(object => {
        const model = new Auto(
            object.id,
            object.titulo,
            object.transaccion,
            object.descripcion,
            object.precio,
            object.puertas,
            object.kms,
            object.potencia,
        );
        items.push(model);
    });
    rellenarTabla();
    removerSpinner();
}

async function escuchandoSubmitFormulario()
{
        formulario.addEventListener("submit", async (event) =>{
        event.preventDefault();

        const model = new Auto(
            Date.now(),
            formulario.titulo.value,
            formulario.transaccion.value,
            formulario.descripcion.value,
            formulario.precio.value,
            formulario.puertas.value,
            formulario.kms.value,
            formulario.potencia.value
        );

        const validado = model.validarDatos();
        if (validado){
            inyectarSpinner();
            items.push(model);
            await escribir(KEY_STORAGE, items);
            actualizarFormulario();
            rellenarTabla();
            removerSpinner();
        }
    })
}

function actualizarFormulario() {
    formulario.reset();
}

function rellenarTabla()
{
    const celdas = ["titulo", "transaccion", "descripcion", "precio", "puertas", "kms", "potencia"];
    const tabla = document.getElementById("table-items");
    var tbody = tabla.getElementsByTagName('tbody')[0]; // Retorna un array, me llevo la primera posicion (la unica)
    tbody.innerHTML = '';

    items.forEach((item) => {
        let nuevaFila = document.createElement("tr");
        nuevaFila.setAttribute("data-id", item["id"]);
        celdas.forEach((celda) => {
            let nuevaCelda = document.createElement("td");
            nuevaCelda.textContent = item[celda];
            nuevaFila.appendChild(nuevaCelda);
            
        });
        tbody.appendChild(nuevaFila);
    });
    
}

function escuchandoClickTabla()
{
    const table = document.getElementById("table-items");
    table.addEventListener("click", (event) => {
        if (event.target.matches("td")){
            let id = event.target.parentNode.dataset.id;
            const item = items.filter((item) => parseInt(item.id) === parseInt(id))[0];
            formulario.idAnuncio.value = item.id;
            formulario.titulo.value = item.titulo;
            formulario.transaccion.value = item.transaccion;
            formulario.descripcion.value = item.descripcion;
            formulario.precio.value = item.precio;
            formulario.puertas.value = item.puertas;
            formulario.kms.value = item.kms;
            formulario.potencia.value = item.potencia;
            mostrarBotonesModificacion(true);
            
        }
      });
}

async function escucharBotonesGuardarAndEliminar()
{
    const botones = document.getElementById("btn-group");
    botones.addEventListener("click", async (event) => {
        let index = items.findIndex(fila => parseInt(fila.id) == parseInt(formulario.idAnuncio.value));
        if(index !==-1){
            if (event.target.id == "modify-cell")
            {
                const model = new Auto(
                    formulario.idAnuncio.value,
                    formulario.titulo.value,
                    formulario.transaccion.value,
                    formulario.descripcion.value,
                    formulario.precio.value,
                    formulario.puertas.value,
                    formulario.kms.value,
                    formulario.potencia.value
                );
                items.splice(index, 1, model)
            }
            else
            {
                if(event.target.id == "delete-cell")
                {
                    items.splice(index, 1);
                }
            }
            
            inyectarSpinner();
            mostrarBotonesModificacion(false);
            actualizarFormulario();
            await escribir(KEY_STORAGE, items);
            rellenarTabla();
            removerSpinner();
        }
    });
}


function escuchandoBtnCancelar()
{
    btnCancelar.addEventListener("click", (event) => {
        mostrarBotonesModificacion(false);
        actualizarFormulario();
    });
}


async function escuchandoBtnDeleteAll() {
    const btn = document.getElementById("btn-delete-all");
    btn.addEventListener("click", async (e) => {

        if(confirm("Desea eliminar todos los Items?")) {
            inyectarSpinner();
            items.splice(0, items.length);
            await limpiar (KEY_STORAGE);
            rellenarTabla();
            removerSpinner();
        }
    });
}

function mostrarBotonesModificacion(mostrar) {
    if (mostrar) {
        btnCargarAnuncio.className = "btn hidden green";
        btnGuardar.className = "btn green";
        btnCancelar.className = "btn yellow";
        btnEliminar.className = "btn red";

    } else {
        btnCargarAnuncio.className = "btn green";
        btnGuardar.className = "btn hidden green";
        btnCancelar.className = "btn hidden yellow";
        btnEliminar.className = "btn hidden red";
    }
  }


function inyectarSpinner() {
    const contenedor = document.getElementById("spinner-container");
    const spinner = document.createElement("img");
    spinner.setAttribute("src", "./assets/spinner.gif");
    spinner.setAttribute("alt", "imagen spinner");
    spinner.setAttribute("height", "64px");
    spinner.setAttribute("width", "64px");
    contenedor.appendChild(spinner);
  }

function removerSpinner() {
    const contenedor = document.getElementById("spinner-container");
    contenedor.removeChild(contenedor.firstChild);
}