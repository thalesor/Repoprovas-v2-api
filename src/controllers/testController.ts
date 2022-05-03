import { Request, Response } from "express";
import testService from "../services/testService.js";

async function findByDiscipline(req: Request, res: Response) {

  const { disciplineName } = req.query as { disciplineName: string };

  const tests = await testService.findByDiscipline(disciplineName);
  res.send({ tests });
}

async function findByTeacher(req: Request, res: Response) {

  const { teacherName } = req.query as { teacherName: string };

  const tests = await testService.findByTeacher(teacherName);
  res.send({ tests });
}

async function create(req: Request, res: Response) {
  const test = req.body;

  await testService.create(test);

  res.sendStatus(201);
}

async function updateView(req: Request, res: Response) {
  
  const { id } = req.params;
  
  const views = await testService.updateViews(Number(id));

  res.send({views});
}

export default {
  findByDiscipline,
  findByTeacher,
  create,
  updateView
};
