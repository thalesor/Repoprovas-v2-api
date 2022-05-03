import  app  from '../src/app.js';
import supertest from 'supertest';
import { prisma } from "../src/database.js";
import userBodyFactory from "./factories/userBodyFactory.js";
import userFactory from "./factories/userFactory.js";
import testBodyFactory from "./factories/testBodyFactory.js";

describe("GET /tests", () => {

  beforeEach(truncateUsers);
  afterAll(disconnect);

  it("IT WILL EXECUTE JUST ONCE: given an invalid token or no token at all it should return 401", async () => {

      const result = await supertest(app).get("/tests/disciplines");
      const status = result.status;
      
      expect(status).toEqual(401);
  });
  
  it("given a valid token it should have tests property", async () => {
    const token = await tokenFactory();

    const response2 = await supertest(app).get("/tests/disciplines")
      .set({ 'Authorization': `Bearer ${token}` });
      
      expect(response2.body).toHaveProperty('tests');
  });

  
});

describe("GET /teachers", () => {

    beforeEach(truncateUsers);
    afterAll(disconnect);
    
    it("given a valid token but disciplineId othen than number or no disciplineId it should return 409", async () => {
      const token = await tokenFactory();

      const { status } = await supertest(app).get("/teachers?disciplineId=bananinha")
        .set({ 'Authorization': `Bearer ${token}` });
        
        expect(status).toBe(409);
    });

    it("given a valid token and number disciplineId it should have property teachers", async () => {
      const token = await tokenFactory();
      
      const response2 = await supertest(app).get("/teachers?disciplineId=9999")
        .set({ 'Authorization': `Bearer ${token}` });
        
        expect(response2.body).toHaveProperty('teachers');
    });
    
});

describe("GET /disciplines", () => {

  beforeEach(truncateUsers);
  afterAll(disconnect);

  it("given a valid token  it should have property disciplines", async () => {
    const token = await tokenFactory();
      
    const response2 = await supertest(app).get("/disciplines")
      .set({ 'Authorization': `Bearer ${token}` });
      
      expect(response2.body).toHaveProperty('disciplines');
  });
  
});

describe("GET /categories", () => {

  beforeEach(truncateUsers);
  afterAll(disconnect);

  it("given a valid token  it should have property categories", async () => {
    const token = await tokenFactory();
      
    const response2 = await supertest(app).get("/categories")
      .set({ 'Authorization': `Bearer ${token}` });
      
      expect(response2.body).toHaveProperty('categories');
  });
  
});

describe("POST /tests", () => {

  beforeEach(truncateUsers);
  beforeEach(truncateTests);
  afterAll(disconnect);

  it("given valid test credentials but duplicate name for test it should return 409", async () => {
    const token = await tokenFactory();
      
    const testBody = testBodyFactory();

    testBody.categoryId = 1;
    testBody.teacherId = 1;
    testBody.disciplineId = 1;

    const response2 = await supertest(app).post("/tests")
      .set({ 'Authorization': `Bearer ${token}` }).send(testBody);

      const { status } = await supertest(app).post("/tests")
      .set({ 'Authorization': `Bearer ${token}` }).send(testBody);
      
      expect(status).toBe(409);
  });

  it("given valid test credentials but non existent categoryId it should return 409", async () => {
    const token = await tokenFactory();
      
    const testBody = testBodyFactory();

    testBody.categoryId = 999;
    testBody.teacherId = 1;
    testBody.disciplineId = 1;

    const { status } = await supertest(app).post("/tests")
      .set({ 'Authorization': `Bearer ${token}` }).send(testBody);
      
      expect(status).toBe(409);
  });

  it("given valid test credentials but non existent disciplineId or teacherId it should return 409", async () => {
    const token = await tokenFactory();
      
    const testBody = testBodyFactory();

    testBody.categoryId = 3;
    testBody.teacherId = 999;
    testBody.disciplineId = 999;

    const { status } = await supertest(app).post("/tests")
      .set({ 'Authorization': `Bearer ${token}` }).send(testBody);
      
      expect(status).toBe(409);
  });


  it("given invalid test credentials it should return 422", async () => {
    const token = await tokenFactory();
      
    const testBody = testBodyFactory();

    testBody.categoryId = -1;
    testBody.teacherId = -1;
    testBody.disciplineId = -1;

    const { status } = await supertest(app).post("/tests")
      .set({ 'Authorization': `Bearer ${token}` }).send(testBody);
      
      expect(status).toBe(422);
  });

  it("given valid test credentials it should return 201", async () => {
    const token = await tokenFactory();
      
    const testBody = testBodyFactory();

    testBody.categoryId = 1;
    testBody.teacherId = 1;
    testBody.disciplineId = 1;

    const { status } = await supertest(app).post("/tests")
      .set({ 'Authorization': `Bearer ${token}` }).send(testBody);
      
      expect(status).toBe(201);
  });
  
});


describe("PUT /tests/:id", () => {

  beforeEach(truncateUsers);
  beforeEach(truncateTests);
  afterAll(disconnect);

  it("given invalid or no test id it should return 409", async () => {
    const token = await tokenFactory();

    const { status } = await supertest(app).put("/tests/bananinha")
    .set({ 'Authorization': `Bearer ${token}` });
    
    expect(status).toBe(409);

  });

  it("given non existent test id it should return 409", async () => {
    const token = await tokenFactory();

    const { status } = await supertest(app).put("/tests/1")
    .set({ 'Authorization': `Bearer ${token}` });
    
    expect(status).toBe(409);

  });

  it("given existent test id it should have views property", async () => {
    const token = await tokenFactory();
    
    const testBody = testBodyFactory();

    testBody.categoryId = 1;
    testBody.teacherId = 1;
    testBody.disciplineId = 1;

    await supertest(app).post("/tests")
      .set({ 'Authorization': `Bearer ${token}` }).send(testBody);

      const responseViews = await supertest(app).put("/tests/1")
      .set({ 'Authorization': `Bearer ${token}` });
      
      expect(responseViews.body).toHaveProperty('views');
  });
  
});

async function disconnect() {
  await prisma.$disconnect();
}

async function truncateUsers() {
  await prisma.$executeRaw`TRUNCATE TABLE users RESTART IDENTITY;`;
}

async function truncateTests() {
  await prisma.$executeRaw`TRUNCATE TABLE tests RESTART IDENTITY;`;
}

async function tokenFactory(){
  const body = userBodyFactory();
    await userFactory(body);

    const response1 = await supertest(app).post("/sign-in").send(body);
    const { token } = response1.body;
    return token;
}