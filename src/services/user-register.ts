import { hash } from "bcryptjs";
import { prisma } from "../lib/prisma";

interface userRegisterProps {
  name: string;
  email: string;
  password: string;
}

export async function userRegisterService({
  name,
  email,
  password,
}: userRegisterProps) {
  const password_hash = await hash(password, 6);

  const emailAlreadyExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (emailAlreadyExist) {
    throw new Error("E-mail already exist");
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
    },
  });
}
