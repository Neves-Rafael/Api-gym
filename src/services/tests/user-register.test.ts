import { test, expect, describe, beforeEach } from "vitest";
import { UserRegisterService } from "../user-register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/in-memory-users-repository";
import { UseAlreadyExistError } from "../erros/user-already-exist-error";

let inMemoryUserRepository: InMemoryUsersRepository;
let sut: UserRegisterService;

describe("Register User Service", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    sut = new UserRegisterService(inMemoryUserRepository);
  });

  test("user password hash exist in registration", async () => {
    const { user } = await sut.execute({
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
    const email = "johndoe@gmail.com";

    await sut.execute({
      name: "John Doe",
      email,
      password: "123456",
    });

    await expect(() =>
      sut.execute({
        name: "John Doe",
        email,
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(UseAlreadyExistError);
  });

  test("user can make a register", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });
});
