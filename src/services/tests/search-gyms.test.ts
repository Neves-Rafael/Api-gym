import { test, expect, describe, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "../../repositories/in-memory/in-memory-gyms-repository";
import { SearchGymService } from "../search-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymService;

describe("Search Gyms Service", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymService(gymsRepository);
  });

  test("be able to search for gyms", async () => {
    await gymsRepository.create({
      title: "JavaScript Gym",
      description: null,
      phone: null,
      latitude: -15.9393152,
      longitude: -48.0307621,
    });

    await gymsRepository.create({
      title: "TypeScript Gym",
      description: null,
      phone: null,
      latitude: -15.9393152,
      longitude: -48.0307621,
    });

    const { gyms } = await sut.execute({
      query: "TypeScript Gym",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "TypeScript Gym" }),
    ]);
  });

  test("be able to fetch paginated gym search", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `TypeScript Gym ${i}`,
        description: null,
        phone: null,
        latitude: -15.9393152,
        longitude: -48.0307621,
      });
    }

    const { gyms } = await sut.execute({
      query: "TypeScript",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "TypeScript Gym 21" }),
      expect.objectContaining({ title: "TypeScript Gym 22" }),
    ]);
  });
});
