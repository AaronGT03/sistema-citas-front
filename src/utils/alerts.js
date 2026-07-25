import Swal from "sweetalert2";

const configBase = {
  background: "#111827",
  color: "#ffffff",
  confirmButtonColor: "#2563eb",
  cancelButtonColor: "#374151",
  customClass: {
    popup: "moga-alert",
  },
};

export const alertaExito = (
  titulo,
  texto = "",
) => {
  return Swal.fire({
    ...configBase,
    icon: "success",
    title: titulo,
    text: texto,
  });
};

export const alertaError = (
  titulo,
  texto = "",
) => {
  return Swal.fire({
    ...configBase,
    icon: "error",
    title: titulo,
    text: texto,
  });
};

export const alertaInfo = (
  titulo,
  texto = "",
) => {
  return Swal.fire({
    ...configBase,
    icon: "info",
    title: titulo,
    text: texto,
  });
};

export const alertaWarning = (
  titulo,
  texto = "",
) => {
  return Swal.fire({
    ...configBase,
    icon: "warning",
    title: titulo,
    text: texto,
  });
};

export const alertaNuevaCita = (cita) => {
  return Swal.fire({
    ...configBase,
    toast: true,
    position: "top-end",
    icon: "success",
    title: "Nueva cita recibida",
    html: `<strong>${cita.nombre}</strong><br/>${
      [cita.servicio_nombre, cita.canal].filter(Boolean).join(" · ")
    }<br/>${cita.fecha}${cita.hora ? ` ${cita.hora}` : " (sin hora específica)"}`,
    showConfirmButton: false,
    timer: 6000,
    timerProgressBar: true,
  });
};

export const confirmar = async ({
  titulo = "¿Estás seguro?",
  texto = "",
  icono = "question",
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
  colorConfirmar = "#2563eb",
} = {}) => {
  const result = await Swal.fire({
    ...configBase,

    title: titulo,
    text: texto,
    icon: icono,

    showCancelButton: true,

    confirmButtonText: textoConfirmar,
    cancelButtonText: textoCancelar,

    confirmButtonColor: colorConfirmar,
  });

  return result.isConfirmed;
};