import { Request, Response } from "express";
import teacherService from "../services/teacherService.js";

async function findManyByDiscipline(req: Request, res: Response) {
  
  const { disciplineId } = req.query;

    const teachers = await teacherService.findManyByDiscipline(Number(disciplineId));
    
    return res.send({ teachers });
  
}



export default {
  findManyByDiscipline
};
