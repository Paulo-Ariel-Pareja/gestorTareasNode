import Swal from "sweetalert2";
import axios from "axios";
const btnEliminar = document.querySelector("#eliminar-proyecto");

if (btnEliminar) {
  btnEliminar.addEventListener("click", e => {
    const urlProyecto = e.target.dataset.proyectoUrl;
    Swal.fire({
      title: "Estas seguro?",
      text: "Desea eliminar el proyecto? no se puede recuperar.",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar"
    }).then(result => {
      if (result.value) {
        const url = `${location.origin}/proyectos/${urlProyecto}`;
        axios
          .delete(url, { params: { urlProyecto } })
          .then(function(respuesta) {
            console.log(respuesta);
            Swal.fire({
              type: "success",
              title: respuesta.data,
              showConfirmButton: false,
              timer: 1500
            });
            setTimeout(() => {
              window.location.href = "/";
            }, 1500);
          })
          .catch(() => {
              Swal.fire({
                  type: error,
                  title: 'Hubo un error',
                  text: 'No se pudo eliminar el proyecto'
              })
          })
      }
    });
  });
}

export default btnEliminar;
