const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));

afterAll(() => {
  db.end();
});

describe("GET - /api/categories", () => {
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

  describe("-error tests", () => {
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

describe("GET - /api/reviews", () => {
  test("GET - 200: responds with an array of review objects with 9 properties, sorted by date DESC", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy("created_at", { descending: true });
        expect(body.length > 0).toBe(true);
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

describe("GET - /api/reviews/:review_id", () => {
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
  describe("-error tests", () => {
    test("GET - 404: responds with an error message, when passed an invalid review_id", () => {
      return request(app)
        .get("/api/reviews/999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Review id 999 not found!");
        });
    });
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
  describe("-error tests", () => {
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
});

describe("POST - /api/reviews/:review_id/comments", () => {
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
  describe("-error tests", () => {
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
          expect(body.msg).toBe("invalid request");
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
          expect(body.msg).toBe("invalid request");
        });
    });
    test("GET - 404: responds with an error message when passed an invalid username", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({
          username: "Angel999",
          body: "I love the game but there should be a few bug fixes!",
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Angel999 not found!");
        });
    });
    test("GET 400: responds with invalid request msg if username key spelt incorrectly", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({
          userne: "mallionaire",
          body: "I love the game but there should be a few bug fixes!",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid request");
        });
    });
    test("GET 400: responds with invalid request msg if body spelt incorrectly", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({
          username: "mallionaire",
          by: "I love the game but there should be a few bug fixes!",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid request");
        });
    });
    test("GET 400: responds with error message for wrong data type", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({
          username: "mallionaire",
          body: 9999999,
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "body data type incorrect - needs to be a string"
          );
        });
    });
  });
});

describe("PATCH - /api/reviews/:review_id", () => {
  test("PATCH - 200: increment reviews vote by specified amount and responds with the updated review", () => {
    return request(app)
      .patch("/api/reviews/4")
      .send({
        inc_votes: 100,
      })
      .expect(200)
      .then(({ body }) => {
        expect.objectContaining({
          review_id: 4,
          title: expect.any(String),
          designer: expect.any(String),
          owner: expect.any(String),
          review_img_url: expect.any(String),
          review_body: expect.any(String),
          category: expect.any(String),
          created_at: expect.any(String),
          votes: 107,
        });
      });
  });
  test("PATCH - 200: decrement reviews vote by specified amount and responds with the updated review", () => {
    return request(app)
      .patch("/api/reviews/4")
      .send({
        inc_votes: -100,
      })
      .expect(200)
      .then(({ body }) => {
        expect.objectContaining({
          review_id: 4,
          title: expect.any(String),
          designer: expect.any(String),
          owner: expect.any(String),
          review_img_url: expect.any(String),
          review_body: expect.any(String),
          category: expect.any(String),
          created_at: expect.any(String),
          votes: -93,
        });
      });
  });
  describe("-error tests", () => {
    test("GET - 404: responds with an error message, when passed an invalid review_id", () => {
      return request(app)
        .patch("/api/reviews/999")
        .send({
          inc_votes: -100,
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Comments with review id 999 not found!");
        });
    });
    test("GET - 400: responds with an error message, when passed an invalid review id", () => {
      return request(app)
        .patch("/api/reviews/nonsense")
        .send({
          inc_votes: -100,
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid query!");
        });
    });
    test("GET 400: responds with update failed message if passed an invalid increment", () => {
      return request(app)
        .patch("/api/reviews/4")
        .send({
          inc_votes: "one hundred",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("update failed, increment data type incorrect");
        });
    });
    test("GET 400: responds with invalid request msg if inc_votes spelt incorrectly", () => {
      return request(app)
        .patch("/api/reviews/4")
        .send({
          inckkk_votez: 100,
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid request");
        });
    });
  });
});

describe("GET - /api/users", () => {
  test("GET - 200: responds with an array of user objects ", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length > 0).toBe(true);
        body.users.forEach((user) => {
          expect.objectContaining({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  describe("-error tests", () => {
    test("GET - 404: responds with an error message, (Not found!), when passed an invalid query", () => {
      return request(app)
        .get("/nonsense")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found!");
        });
    });
  });
});

describe("GET - 200: /api/reviews/:review_id", () => {
  test("GET - 200: responds with a review response objects including comment count", () => {
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
          comment_count: 3,
        });
      });
  });
});

describe("GET - /api/reviews", () => {
  test("GET - 200: responds with an array of review objects sorted by date DESC", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy("created_at", { descending: true });
        expect(body.length > 0).toBe(true);
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
  test("GET - 200: Responds with an array of reviews sorted by category", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        expect(body.length > 0).toBe(true);
        expect(body).toBeSorted("votes");
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
  test("GET - 200: Responds with an array of reviews sorted by category", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200)
      .then(({ body }) => {
        expect(body.length > 0).toBe(true);
        body.forEach((review) => {
          expect(review).toEqual({
            category: "dexterity",
            comment_count: expect.any(String),
            created_at: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_id: expect.any(Number),
            review_img_url: expect.any(String),
            title: expect.any(String),
            votes: expect.any(Number),
          });
        });
      });
  });
  describe("-error tests", () => {
    test("GET - 404: responds with an error message, (Not found!), when passed an invalid endpoint", () => {
      return request(app)
        .get("/nonsense")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found!");
        });
    });
    test("GET - 400: Responds with an invalid sort_by query if passed an invalid sort_by query", () => {
      return request(app)
        .get("/api/reviews?sort_by=nonsense")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid sort query");
        });
    });
    test("GET - 400: Responds with an invalid order query if passed an invalid order query", () => {
      return request(app)
        .get("/api/reviews?order=increasing")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid order query");
        });
    });
  });
});
