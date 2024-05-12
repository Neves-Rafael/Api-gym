import { test, expect, describe, beforeEach } from "vitest";
import { InMemoryCheckInsRepository } from "../../repositories/in-memory/in-memory-check-in.repository";
import { CheckInService } from "../check-ins";

let CheckInsRepository: InMemoryCheckInsRepository;
let sut: CheckInService;

describe("Check-in Service", () => {
  beforeEach(() => {
    CheckInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInService(CheckInsRepository);
  });

  test("able to check-in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
