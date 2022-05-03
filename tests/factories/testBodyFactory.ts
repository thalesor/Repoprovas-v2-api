import { faker } from "@faker-js/faker";
import { TestBodyData } from "../../src/services/testService";

export default function testBodyFactory(): TestBodyData {
  return {
    name: faker.name.findName(),
    pdfUrl: faker.name.findName()+'.pdf',
    categoryId: 0,
    teacherId: 0,
    disciplineId: 0
  };
}