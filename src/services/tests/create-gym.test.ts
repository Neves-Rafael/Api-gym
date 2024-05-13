import { test, expect, describe, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "../../repositories/in-memory/in-memory-gyms-repository";
import { CreateGymService } from "../create-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymService;

describe("Register User Service", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymService(gymsRepository);
  });

  test("be able to create gym", async () => {
    const { gym } = await sut.execute({
      title: "JavaScript Gym",
      description: null,
      phone: null,
      latitude: -15.9393152,
      longitude: -48.0307621,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
