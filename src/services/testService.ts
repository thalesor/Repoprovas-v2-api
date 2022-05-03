import { Test } from "@prisma/client";
import categoryRepository from "../repositories/categoryRepository.js";
import teacherRepository from "../repositories/teacherRepository.js";
import testRepository from "../repositories/testRepository.js";
import { conflictError } from "../utils/errorUtils.js";

export interface TestBodyData {
  name: string;
  pdfUrl?: string;
  categoryId: number;
  teacherId: number;
  disciplineId: number;
}

export type CreateTestData = Omit<Test, "id" | "views">;
export type UpdateTestData = Partial<Test>;


export async function findByDiscipline(disciplineName: string | null = null) {
  
    return testRepository.getTestsByDiscipline(disciplineName);
  
  
}

export async function findByTeacher(teacherName: string | null = null) {
  
  const tests = await testRepository.getTestsByTeachers(teacherName);
  if(teacherName)
   return tests.filter((test) => test.teacher.name.lastIndexOf(`${teacherName}`) > -1);
    
    return testRepository.getTestsByTeachers(teacherName);

}

async function create(testData: TestBodyData) {
  
    const existingTestName = await testRepository.findByName(testData.name);
    if (existingTestName) throw conflictError("O nome da prova deve ser único, escolha outro nome");
    
    
    const existingCategory = await categoryRepository.findById(testData.categoryId);
    if (!existingCategory) throw conflictError("A categoria informada não existe");
    
    const teacherDisciplineId = await teacherRepository.getTeacherDisciplineId(Number(testData.teacherId), Number(testData.disciplineId));
    if(!teacherDisciplineId) throw conflictError("Essa combinação de professor e disciplina não existe")
    
    const { name, pdfUrl, categoryId } = testData;

    const test = { name: name, pdfUrl: pdfUrl, categoryId: categoryId, teacherDisciplineId: teacherDisciplineId};

    await testRepository.create(test);
    
}

async function updateViews(id: number) {
  
  if(!id || typeof id !== "number")
  throw conflictError("Falta informar o id da prova como um número");
  
  const existingTest = await testRepository.findById(id);
    if (!existingTest) throw conflictError("A prova informada não existe");

  const updateObj = { views: existingTest.views+1 as number };

  const result = await testRepository.update(id, updateObj);
  return result.views;

}

export default {
  findByDiscipline,
  findByTeacher,
  create,
  updateViews
};
