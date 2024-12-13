import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const projects = await prisma.project.findMany();
    res.json(projects);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving projects ${error.message}` });
  }
};

export const getProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { projectId } = req.query;
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: Number(projectId),
      },
    });
    res.json(project);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving project ${error.message}` });
  }
};

export const createProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, startDate, endDate } = req.body;
  try {
    const project = await prisma.project.create({
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });
    res.status(201).json(project);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating project ${error.message}` });
  }
};

export const deleteProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { projectId } = req.params;
  try {
    // Delete related records first
    await prisma.projectTeam.deleteMany({
      where: { projectId: Number(projectId) },
    });
    const project = await prisma.project.delete({
      where: {
        id: Number(projectId),
      },
    });
    res.json(project);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error deleting project ${error.message}` });
  }
};
