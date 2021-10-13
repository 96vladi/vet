//Campos del formulario
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');


// UI
const formulario = document.querySelector('#nueva-cita');
const contenidoCitas = document.querySelector('#citas');
let editando;

//CLASE DE ADMINISTRADOR DE CITAS
class citas{
  constructor(){
    this.citas = [];
  }

  agregarCita(cita){
    this.citas = [...this.citas, cita];

    //console.log(this.citas);
  }
  eliminarCita(id){
    this.citas = this.citas.filter( cita => cita.id !== id );
  }

  editarCita(citaActualizada){ //El MAP sirve para sobreescribir un arregloy no elimnar los demas
    this.citas = this.citas.map( cita => cita.id ===  citaActualizada.id ? citaActualizada : cita);
  }
}

//CLASE DE INTERFAZ DE USUARIO
class UI{

  imprimirAlerta(mensaje, tipo){
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');
    // Agregar clase en error
    if (tipo === 'error') {
      divMensaje.classList.add('alert-danger');
    }else {
      divMensaje.classList.add('alert-success');
    }

    //Mensaje de error
    divMensaje.textContent = mensaje;
    //Agregar al doom
    document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));
    //Quitar la alerta despues de 5 segundos
    setTimeout( () => {
      divMensaje.remove();
    }, 5000 );
  }

  imprimirCita({citas}){ //Se aplica distruction dentro de los parentesis
      this.limpiarHTML();
      citas.forEach( cita => {
      const { mascota,propietario,telefono,fecha,hora,sintomas,id } = cita;
      const divCita = document.createElement('div');
      divCita.classList.add('cita', 'p-3');
      divCita.dataset.id = id;

      //Scripting de los elementos de la cita
      const mascotaParrafo = document.createElement('h2');
      mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
      mascotaParrafo.textContent = mascota;

      const propietarioParrafo = document.createElement('p');
      propietarioParrafo.innerHTML = `
        <span class="font-weight-bolder">Propietario: </span> ${propietario}
      `;

      const telefonoParrafo = document.createElement('p');
      telefonoParrafo.innerHTML = `
        <span class="font-weight-bolder">Telefono: </span> ${telefono}
      `;

      const fechaParrafo = document.createElement('p');
      fechaParrafo.innerHTML = `
        <span class="font-weight-bolder">Telefono: </span> ${fecha}
      `;

      const horaParrafo = document.createElement('p');
      horaParrafo.innerHTML = `
        <span class="font-weight-bolder">Telefono: </span> ${hora}
      `;

      const sintomasParrafo = document.createElement('p');
      sintomasParrafo.innerHTML = `
        <span class="font-weight-bolder">Telefono: </span> ${sintomas}
      `;

      //Boton para eliminar la cita
      const btnEliminar = document.createElement('button');
      btnEliminar.classList.add('btn','btn-danger', 'mr-2',);
      btnEliminar.innerHTML = 'Elimnar';
      btnEliminar.onclick = () => eliminarCita(id);
      //Boton para editar la cita
      const btnEditar = document.createElement('button');
      btnEditar.classList.add('btn','btn-info');
      btnEditar.innerHTML = 'Editar';
      btnEditar.onclick = () => cargarEdicion(cita);

      //Agregar los parrafos al divCita
      divCita.appendChild(mascotaParrafo);
      divCita.appendChild(propietarioParrafo);
      divCita.appendChild(telefonoParrafo);
      divCita.appendChild(fechaParrafo);
      divCita.appendChild(horaParrafo);
      divCita.appendChild(sintomasParrafo);
      divCita.appendChild(btnEliminar);
      divCita.appendChild(btnEditar);

      //Agregar las citas al HTML
      contenidoCitas.appendChild(divCita);
    });
  }
  limpiarHTML(){
    while (contenidoCitas.firstChild) {
      contenidoCitas.removeChild( contenidoCitas.firstChild );
    }
  }
}

const ui = new UI();
const administrarCitas = new citas();

//Funcion eventListeners registro de eventos
eventListeners();
function eventListeners(){
  //manda de golpe la palabra
  //mascotaInput.addEventListener('change', datosCita);
  // Esto es para tiempo real
  mascotaInput.addEventListener('input', datosCita);
  propietarioInput.addEventListener('input', datosCita);
  telefonoInput.addEventListener('input', datosCita);
  fechaInput.addEventListener('input', datosCita);
  horaInput.addEventListener('input', datosCita);
  sintomasInput.addEventListener('input', datosCita);

  formulario.addEventListener('submit', nuevaCita);
}

//Creamos un objeto con informacion de la cita
const citaObj = {
  mascota: '',
  propietario: '',
  telefono: '',
  fecha: '',
  hora: '',
  sintomas: ''
}

//agrega datos a la cita
function datosCita(e){
  //captura lo que el usuario escribe
  //console.log(e.target.value);
  //console.log(e.target.name);
  citaObj[e.target.name] = e.target.value;
  //console.log(citaObj);
}

//Valida y agrega una nueva cita
function nuevaCita(e){
  e.preventDefault();
  //Extraer la informacion del objeto de cita
  const { mascota,propietario,telefono,fecha,hora,sintomas } = citaObj;
  //Validar
  if (mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
    ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
    //console.log("Todos los campos son obligatorios");
    return;
  }

  if (editando) {
    ui.imprimirAlerta('Editado correctamente');
    //Pasar el objerto de la cita
    administrarCitas.editarCita({...citaObj});
    //Regresar el texto del boton a su estado original
    formulario.querySelector('button[type = "submit"]').textContent = 'Crear Cita';
    //Quitando el modo edicion
    editando = false;
  }else {
    //onsole.log("Modo nueva cita");
    //Generar un ID
    citaObj.id = Date.now();

    //Creando una nueva cita
    //console.log(citaObj);
    //Mando solo la copia para que no se repitan los datos {...citaObj}
    administrarCitas.agregarCita({...citaObj});
    //Mensaje de agregado correctamente
    ui.imprimirAlerta('Se agrego correctamente');
  }


  //Reiniciar el objeto para la validacion
  reiniciarObjeto();
  //Reiniciamos el formulario
  formulario.reset();
  //Mostar en el HTML
  ui.imprimirCita(administrarCitas);
}

//Reiniciar el objeto
function reiniciarObjeto(){
  citaObj.mascota = '';
  citaObj.propietario = '';
  citaObj.telefono = '';
  citaObj.fecha = '';
  citaObj.hora = '';
  citaObj.sintomas = '';
}

//Elimina una cita
function eliminarCita(id){
  //console.log(id);
  //eliminar la cita
  administrarCitas.eliminarCita(id);
  //Muestra el mensaje
  ui.imprimirAlerta('La cita se elimino correctamente');
  //Refresca las citas
  ui.imprimirCita(administrarCitas);
}
//carga los datos
function cargarEdicion(cita){
  //console.log(cita);
  const { mascota,propietario,telefono,fecha,hora,sintomas,id } = cita;
  //LLenar los input
  mascotaInput.value = mascota;
  propietarioInput.value = propietario;
  telefonoInput.value = telefono;
  fechaInput.value = fecha;
  horaInput.value = hora;
  sintomasInput.value = sintomas;

  //LLenar el objeto
  citaObj.mascota = mascota;
  citaObj.propietario = propietario;
  citaObj.telefono = telefono;
  citaObj.fecha = fecha;
  citaObj.hora = hora;
  citaObj.sintomas = sintomas;
  citaObj.id = id;

  //Cambiar el texto del boton
  formulario.querySelector('button[type = "submit"]').textContent = 'Guardar Cambios';

  editando = true;
}
