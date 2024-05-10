import { test, expect, describe } from "vitest";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/in-memory-users-repository";
import { AuthenticateService } from "../authenticate";
import { InvalidCredentialsError } from "../erros/invalid-credentials-error";

describe("Authenticate Service", () => {
  test("able to authenticate", async () => {
    const inMemoryUserRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateService(inMemoryUserRepository);

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
    const inMemoryUserRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateService(inMemoryUserRepository);

    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  test("not able to authenticate with wrong password", async () => {
    const inMemoryUserRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateService(inMemoryUserRepository);

    await inMemoryUserRepository.create({
      name: "john doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        password: "123321",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
