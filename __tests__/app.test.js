const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));

afterAll(() => {
  db.end();
});

describe("/api/categories", () => {
  test("GET - 200: responds with an array of category objects with slug and description as properties", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(body.length > 0).toBe(true);
        body.forEach((category) => {
          expect.objectContaining({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("/api/nonsense - invalid endpoint", () => {
  test("GET - 404: responds with an error message, (Not found!), when passed an invalid endpoint", () => {
    return request(app)
      .get("/nonsense")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found!");
      });
  });
});
