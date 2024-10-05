import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving users ${error.message}` });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  const { username } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { userId: Number(userId) },
      data: { username },
    });
    res.json(updatedUser);
  } catch (error: any) {
    res.status(500).json({ message: `Error updating user ${error.message}` });
  }
};
