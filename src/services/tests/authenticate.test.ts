import { test, expect, describe, beforeEach } from "vitest";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/in-memory-users-repository";
import { AuthenticateService } from "../authenticate";
import { InvalidCredentialsError } from "../erros/invalid-credentials-error";

let inMemoryUserRepository: InMemoryUsersRepository;
let sut: AuthenticateService;

describe("Authenticate Service", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    sut = new AuthenticateService(inMemoryUserRepository);
  });

  test("able to authenticate", async () => {
    await inMemoryUserRepository.create({
      name: "john doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  test("not able to authenticate with wrong email", async () => {
    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  test("not able to authenticate with wrong password", async () => {
    await inMemoryUserRepository.create({
      name: "john doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        password: "123321",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
