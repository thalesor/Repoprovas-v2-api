import { Router } from "express";
import testController from "../controllers/testController.js";
import { ensureAuthenticatedMiddleware } from "../middlewares/ensureAuthenticatedMiddleware.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import { testSchema } from "../schemas/testSchema.js";

const testRouter = Router();

testRouter.get("/tests/disciplines",
  ensureAuthenticatedMiddleware,
  testController.findByDiscipline);

  testRouter.get("/tests/teachers",
  //ensureAuthenticatedMiddleware,
  testController.findByTeacher);

testRouter.post(
  "/tests",
  ensureAuthenticatedMiddleware,
  validateSchemaMiddleware(testSchema),
  testController.create
);

testRouter.put("/tests/:id", ensureAuthenticatedMiddleware, testController.updateView);

export default testRouter;
