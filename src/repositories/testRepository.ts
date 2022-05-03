import { prisma } from "../database.js";
import { CreateTestData, UpdateTestData } from "../services/testService";

async function getTestsByDiscipline(disciplineName:string | null = null) {
  if(!disciplineName)
  return prisma.term.findMany({
    include: {
      disciplines: {
        include: {
          teacherDisciplines: {
            include: {
              teacher: true,
              tests: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      },
    },
  });
  else
  return prisma.term.findMany({
    include: {
      disciplines: {
        where:{
          name: {
            contains: disciplineName
          }
        },
        include: {
          teacherDisciplines: {
            include: {
              teacher: true,
              tests: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

async function findByName(name: string) {
  return prisma.test.findFirst({
    where: { name: name }
  });
}

async function findById(id: number) {
  return prisma.test.findUnique({
    where: { id: id }
  });
}

async function getTestsByTeachers(teacherName:string | null = null) {
  //if(!teacherName)
  return prisma.teacherDiscipline.findMany({
    include: {
      teacher: true,
      discipline: true,
      tests: {
        include: {
          category: true,
        },
      },
    },
  });
  /*
  else
  return prisma.teacherDiscipline.findMany({
    where: 
    {
      teacher: 
      {
        name: 
        {
          contains: teacherName
        }
      },
      discipline: true,
      tests: {
        include: {
          category: true,
        },
      },
    },
  });
  */
}



async function update(id: number, updateData: UpdateTestData) {
  return prisma.test.update({
    where: { id: id},
    data: updateData
  });
}

async function create(createTestData: CreateTestData) {
  return prisma.test.create({
    data: createTestData
  });
}

export default {
  getTestsByDiscipline,
  getTestsByTeachers,
  findByName,
  create,
  update,
  findById
};
