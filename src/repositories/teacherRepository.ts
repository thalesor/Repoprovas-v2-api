import { prisma } from "../database.js";


async function findManyByDiscipline(disciplineId: number) {
  return prisma.teacherDiscipline.findMany({
    where: { disciplineId: disciplineId },
    include: { 
      teacher: true
    }
  });
}

async function getTeacherDisciplineId(teacherId: number, disciplineId: number){
  const data = await prisma.teacherDiscipline.findFirst({
    where: { disciplineId: disciplineId, teacherId: teacherId }
  });
  if(data)
  return data.id;
}

export default {
  findManyByDiscipline,
  getTeacherDisciplineId
};
