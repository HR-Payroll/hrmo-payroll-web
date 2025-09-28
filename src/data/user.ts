import { prisma } from "@/../prisma/prisma";

export const getUserById = async (id: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};
