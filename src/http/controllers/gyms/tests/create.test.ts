import request from "supertest";
import { app } from "../../../../app";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { createAndAuthenticateUser } from "../../../../utils/tests/create-and-authenticate-user";

describe("Create Gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  test("be able to create a gym", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const response = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "JavaScript Gym",
        description: "Some description",
        phone: "61999999999",
        latitude: -15.9393152,
        longitude: -48.0307621,
      });

    expect(response.statusCode).toEqual(201);
  });
});
