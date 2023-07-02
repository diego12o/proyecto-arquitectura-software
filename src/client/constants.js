const optionsConfigAlumno = [
  {
    detail: "Evaluar un profesor",
    idService: "evalu",
    action: "addEvaluation",
    requireParams: [
      "id_profesor_curso",
      "comentario",
      "nota",
      "fecha",
      "rut_usuario",
    ],
  },

  {
    detail: "Visualizar promedio de evaluacion de un profesor",
    idService: "evalu",
    action: "seeAvg",
    requireParams: ["id_profesor_curso"],
  },

  {
    detail: "Visualizar evaluación que realizaste",
    idService: "evalu",
    action: "seeEvaluation",
    requireParams: ["rut_usuario"],
  },

  {
    detail: "Editar evaluación que realizaste",
    idService: "evalu",
    action: "editEvaluation",
    requireParams: ["nota", "comentario", "id_profesor_curso", "rut_usuario"],
  },

  {
    detail: "Eliminar una evaluacion que realizaste",
    idService: "evalu",
    action: "deleteEvaluation",
    requireParams: ["id_evaluation, rut_ususario"],
  },

  {
    detail: "Visualizar comentarios a evaluaciones que realizastes",
    idService: "evalu",
    action: "seeComments",
    requireParams: ["rut_usuario"],
  },

  {
    detail: "Escribir comentario a una evaluacion que realizaste",
    idService: "evalu",
    action: "updateComent",
    requireParams: ["rut_usuario", "fecha", "nuevo_comentario"],
  },

  {
    detail: "Eliminar comentario a una evaluacion que realizaste",
    idService: "evalu",
    action: "deleteComentario",
    requireParams: ["rut_usuario", "fecha"],
  },

  {
    detail: "Cambiar contraseña",
    idService: "usuar",
    action: "changePassword",
    requireParams: ["nueva_contraseña", "correo"],
  },
];

const optionsConfigAdmin = [
  ...optionsConfigAlumno,
  {
    detail: "Eliminar cualquier comentario",
    idService: "evalu",
    action: "deleteComentario",
    requireParams: ["rut_usuario", "fecha"],
  },
  {
    detail: "Eliminar cualquier evaluacion",
    idService: "evalu",
    action: "deleteEvaluation",
    requireParams: ["id_evaluation", "rut_usuario"],
  },
  {
    detail: "Crear un nuevo usuario",
    idService: "usuar",
    action: "create",
    requireParams: [
      "rut",
      "correo",
      "contraseña",
      "carreara",
      "nombre",
      "ano",
      "seraAdmin",
    ],
  },
  {
    detail: "Eliminar un usuario",
    idService: "usuar",
    action: "delete",
    requireParams: ["rut"],
  },
  {
    detail: "Inscribir un nuevo curso",
    idService: "curso",
    action: "create",
    requireParams: ["codigo", "carrera", "nombre"],
  },
  {
    detail: "Actualizar un curso",
    idService: "curso",
    action: "update",
    requireParams: ["codigo", "carrera", "nombre"],
  },
  {
    detail: "Eliminar un curso",
    idService: "curso",
    action: "delete",
    requireParams: ["codigo_curso"],
  },
  {
    detail: "Inscribir un nuevo profesor",
    idService: "profe",
    action: "create",
    requireParams: ["nombre", "correo"],
  },
  {
    detail: "Actualizar un profesor",
    idService: "profe",
    action: "update",
    requireParams: ["id", "nombre", "correo"],
  },
  {
    detail: "Eliminar un profesor",
    idService: "profe",
    action: "delete",
    requireParams: ["correo"],
  },
  {
    detail: "Inscribir profesor a un curso",
    idService: "profe",
    action: "enroll",
    requireParams: ["id_profesor", "codigo_curso"],
  },
];

module.exports = { optionsConfigAlumno, optionsConfigAdmin };