import { prisma } from "../../src/database.js";
import { CreateTestData } from "../../src/services/testService.js";

export default async function userFactory(test: CreateTestData) {
  await prisma.test.create({
    data: {
      ...test
    },
  });
}