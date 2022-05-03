import Joi from "joi";
import { TestBodyData } from "../services/testService.js";

export const testSchema = Joi.object<TestBodyData>({
  name: Joi.string().required(),
  pdfUrl: Joi.string(),
  categoryId: Joi.number().positive().required(),
  teacherId: Joi.number().positive().required(),
  disciplineId: Joi.number().positive().required()
});
