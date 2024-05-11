import { test, expect, describe, beforeEach } from "vitest";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/in-memory-users-repository";
import { GetUserProfileService } from "../get-user-profile";
import { ResourceNotFoundError } from "../erros/resource-not-found";

let inMemoryUserRepository: InMemoryUsersRepository;
let sut: GetUserProfileService;

describe("Get User Profile Service", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileService(inMemoryUserRepository);
  });

  test("able to get user profile", async () => {
    const createdUser = await inMemoryUserRepository.create({
      name: "john doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
    });

    expect(user.name).toEqual("john doe");
  });

  test("not able to get user profile", async () => {
    await expect(() =>
      sut.execute({
        userId: "non-existing-id",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
