import { test, expect, describe } from "vitest";
import { UserRegisterService } from "../user-register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/in-memory-users-repository";
import { UseAlreadyExistError } from "../erros/user-already-exist-error";

describe("Register User Service", () => {
  test("user password hash exist in registration", async () => {
    const inMemoryUserRepository = new InMemoryUsersRepository();
    const userRegisterService = new UserRegisterService(inMemoryUserRepository);

    const { user } = await userRegisterService.execute({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  test("create a user with a email already exist", async () => {
    const inMemoryUserRepository = new InMemoryUsersRepository();
    const userRegisterService = new UserRegisterService(inMemoryUserRepository);

    const email = "johndoe@gmail.com";

    await userRegisterService.execute({
      name: "John Doe",
      email,
      password: "123456",
    });

    expect(() =>
      userRegisterService.execute({
        name: "John Doe",
        email,
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(UseAlreadyExistError);
  });

  test("user can make a register", async () => {
    const inMemoryUserRepository = new InMemoryUsersRepository();
    const userRegisterService = new UserRegisterService(inMemoryUserRepository);

    const { user } = await userRegisterService.execute({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });
});
