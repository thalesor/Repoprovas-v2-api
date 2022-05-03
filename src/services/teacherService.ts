import teacherRepository from "../repositories/teacherRepository.js";
import { conflictError } from "../utils/errorUtils.js";

async function findManyByDiscipline(disciplineId: number) {
  if(!disciplineId || typeof Number(disciplineId) !== "number")
  throw conflictError("Falta informar o id da disciplina como um número");
  
  return teacherRepository.findManyByDiscipline(disciplineId);
}

export default {
  findManyByDiscipline
};
