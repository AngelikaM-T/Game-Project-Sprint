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
});

describe("/api/reviews", () => {
  test("GET - 200: responds with an array of review objects with 9 properties, sorted by date DESC", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy("created_at", { descending: true });
        expect(body.length).toBe(2);
        body.forEach((review) => {
          expect(review).toEqual({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
});

describe("/api/reviews/:review_id", () => {
  test("GET - 200: responds with a review object matching given review id", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toMatchObject({
          review_id: 2,
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: expect.any(Number),
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });
  describe("/api/reviews/999 - invalid review_id", () => {
    test("GET - 404: responds with an error message, when passed an invalid review_id", () => {
      return request(app)
        .get("/api/reviews/999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Review id 999 not found!");
        });
    });
  });
  describe("/api/reviews/not-a-number Bad request", () => {
    test("GET - 400: responds with an error message, when passed an invalid request", () => {
      return request(app)
        .get("/api/reviews/not-a-number")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid query!");
        });
    });
  });
});

describe("GET - 200: /api/reviews/:review_id/comments", () => {
  test("should respond with an array of comments for the given review_id", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length > 0).toBe(true);
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            review_id: 2,
          });
        });
      });
  });
  test("GET - 200: responds with an empty array when specified review id has no comments", () => {
    return request(app)
      .get("/api/reviews/5/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("GET - 404: responds with an error message, when passed an invalid review_id", () => {
    return request(app)
      .get("/api/reviews/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comments with review id 999 not found!");
      });
  });
  test("GET - 400: responds with an error message, when passed an invalid request", () => {
    return request(app)
      .get("/api/reviews/nonsense/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid query!");
      });
  });
});

describe.only("/api/reviews/:review_id/comments", () => {
  test("POST - 201: responds with the posted comment", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({
        username: "mallionaire",
        body: "I love the game but there should be a few bug fixes!",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: 7,
          body: "I love the game but there should be a few bug fixes!",
          review_id: 1,
          author: "mallionaire",
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("GET - 404: responds with an error message, when passed an invalid review_id", () => {
    return request(app)
      .post("/api/reviews/999/comments")
      .send({
        username: "mallionaire",
        body: "I love the game but there should be a few bug fixes!",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comments with review id 999 not found!");
      });
  });
  test("GET - 400: responds with an error message, when passed an invalid request", () => {
    return request(app)
      .post("/api/reviews/nonsense/comments")
      .send({
        username: "mallionaire",
        body: "I love the game but there should be a few bug fixes!",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid query!");
      });
  });
  test("GET 400: responds with invalid comment msg if passed a comment without a body", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({
        username: "mallionaire",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid comment");
      });
  });
  test("GET 400: responds with invalid comment msg if passed a comment without the username", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({
        body: "I love the game but there should be a few bug fixes!",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid comment");
      });
  });
});
