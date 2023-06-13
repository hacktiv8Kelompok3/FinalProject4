const app = require("../app");
const request = require("supertest");
const { generateToken } = require("../helpers/jwt");
const { hashPassword } = require("../helpers/bcrypt.js");
const { sequelize } = require("../models");

let token;
let photoId;
let userId;
let commentid;
let newcommentid;
// let newtoken;

const UserData = {
  full_name: "User",
  email: "user@gmail.com",
  username: "user",
  password: "123456789",
  profile_image_url: "https://picsum.photos/id/1/200/200",
  age: 19,
  phone_number: 12345,
};

beforeAll(async () => {
  try {
    // Register a new user
    const registerResponse = await request(app)
      .post("/users/register")
      .send(UserData);
    expect(registerResponse.statusCode).toEqual(201);

    // Login to get the token
    const loginResponse = await request(app).post("/users/login").send({
      email: UserData.email,
      password: UserData.password,
    });
    // expect(loginResponse.statusCode).toEqual(200);

    token = loginResponse.body.viewUser.token;

    userId = loginResponse.body.viewUser.id;

    // Create a new photo
    const createPhotoResponse = await request(app)
      .post("/photo/create")
      .set("token", token)
      .send({
        title: "Photo 1",
        caption: "lorem ipsum",
        poster_image_text: "https://picsum.photos/id/1/200/200",
        UserId: userId,
      });
    expect(createPhotoResponse.statusCode).toEqual(200);

    photoId = createPhotoResponse.body.id;
  } catch (error) {
    console.log(error);
  }
});

describe("POST /comments", () => {
  it("should send response with a 201 status code if user successfully creates a new comment", async () => {
    const commentData = {
      comment: "lorem ipsum this is comment",
      UserId: userId,
      PhotoId: photoId,
    };

    const response = await request(app)
      .post("/comments")
      .set("token", token)
      .send(commentData);

    expect(response.statusCode).toEqual(201);
    expect(typeof response.body).toEqual("object");
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("comment");
    expect(response.body).toHaveProperty("UserId");
    expect(response.body).toHaveProperty("PhotoId");
    newcommentid = response.body.id;
  });
});

describe("POST /comments", () => {
  it("should return 401 status code if user create comment with no authentication", async () => {
    const commentData = {
      comment: "lorem ipsum this is comment",
      UserId: userId,
      PhotoId: photoId,
    };

    const response = await request(app).post("/comments").send(commentData);

    expect(response.statusCode).toEqual(401);
    expect(typeof response.body).toEqual("object");
    expect(response.body).toHaveProperty("message");
    expect(typeof response.body.message).toEqual("string");
    expect(response.body.message).toEqual("Token not provided!");
  });
});

describe("POST /comments", () => {
  it("should return 400 status code if user create comment with null value comment", async () => {
    const commentData = {
      comment: "",
      UserId: userId,
      PhotoId: photoId,
    };
    const response = await request(app)
      .post("/comments")
      .set("token", token)
      .send(commentData);
    //   .send(commentData);

    expect(response.statusCode).toEqual(400);
    expect(typeof response.body).toEqual("object");
    expect(response.body).toHaveProperty("error.comment");
    expect(typeof response.body.error.comment).toEqual("string");
    expect(response.body.error.comment).toEqual("comment tidak boleh kosong");
  });
});

describe("GET /comments", () => {
  it("should return 200 status code if user success get comment", async () => {
    const response = await request(app).get("/comments").set("token", token);

    expect(response.statusCode).toEqual(200);
    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach((comment) => {
      expect(comment).toHaveProperty("id");
      expect(comment).toHaveProperty("comment");
      expect(comment).toHaveProperty("User");
      expect(comment).toHaveProperty("Photo");
      expect(comment).toHaveProperty("PhotoId");
      expect(comment).toHaveProperty("UserId");
    });
  });
});

describe("GET /comments", () => {
  it("should return 401 status code if user get comment with no authentication", async () => {
    const response = await request(app).get("/comments");

    expect(response.statusCode).toEqual(401);
    expect(typeof response.body).toEqual("object");
    expect(response.body).toHaveProperty("message");
    expect(typeof response.body.message).toEqual("string");
    expect(response.body.message).toEqual("Token not provided!");
  });
});

beforeAll(async () => {
  try {
    const createComment = await request(app)
      .post("/comments")
      .set("token", token)
      .send({
        comment: "lorem ipsum this is comment",
        UserId: userId,
        PhotoId: photoId,
      });

    commentid = createComment.body.id;
  } catch (error) {
    console.log(error);
  }
});

describe("PUT /comments/:commentid", () => {
  it("should send response with a 200 status code if user successfully update comment", async () => {
    const comment = {
      comment: "lorem ipsum this is comment update",
    };

    const response = await request(app)
      .put(`/comments/${commentid}`)
      .set("token", token)
      .send(comment);

    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toEqual("object");
    expect(response.body.comment).toHaveProperty("PhotoId");
    expect(response.body).toHaveProperty("comment");
    expect(response.body.comment).toHaveProperty("UserId");
  });
});

describe("PUT /comments/:commentid", () => {
  it("should send response with a 401 status code if user update comment without authentication", async () => {
    const comment = {
      comment: "lorem ipsum this is comment update",
    };

    const response = await request(app)
      .put(`/comments/${commentid}`)
      .send(comment);

    expect(response.statusCode).toEqual(401);
    expect(typeof response.body).toEqual("object");
    expect(response.body).toHaveProperty("message");
    expect(typeof response.body.message).toEqual("string");
    expect(response.body.message).toEqual("Token not provided!");
  });
});

describe("PUT /comments/:commentid", () => {
  it("should send response with a 400 status code if user update comment with null value comment", async () => {
    const comment = {
      comment: "",
    };

    const response = await request(app)
      .put(`/comments/${commentid}`)
      .set("token", token)
      .send(comment);

    expect(response.statusCode).toEqual(400);
    expect(typeof response.body).toEqual("object");
    expect(response.body).toHaveProperty("error.comment");
    expect(typeof response.body.error.comment).toEqual("string");
    expect(response.body.error.comment).toEqual("comment tidak boleh kosong");
  });
});

describe("PUT /comments/:commentid", () => {
  it("should send response with a 404 status code if user update comment with not found id", async () => {
    const comment = {
      comment: "lorem ipsum this is comment update",
    };

    const response = await request(app)
      .put(`/comments/0`)
      .set("token", token)
      .send(comment);

    expect(response.statusCode).toEqual(404);
    expect(typeof response.body).toEqual("object");
    expect(response.body).toHaveProperty("message");
    expect(typeof response.body.message).toEqual("string");
    expect(response.body.message).toEqual("Comment with id 0 not found");
  });
});

describe("DELETE /comments/:commentid", () => {
  it("should send response with a 200 status code if user successfully delete comment", async () => {
    const response = await request(app)
      .delete(`/comments/${commentid}`)
      .set("token", token);

    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toEqual("object");
    expect(response.body).toHaveProperty("message");
  });
});

describe("DELETE /comments/:commentid", () => {
  it("should send response with a 404 status code if user delete comment with not found id", async () => {
    const response = await request(app)
      .delete(`/comments/0`)
      .set("token", token);

    expect(response.statusCode).toEqual(404);
    expect(typeof response.body).toEqual("object");
    expect(response.body).toHaveProperty("message");
    expect(typeof response.body.message).toEqual("string");
    expect(response.body.message).toEqual("Comment with id 0 not found");
  });
});

describe("DELETE /comments/:commentid", () => {
  it("should send response with a 404 status code if user delete comment with not found id", async () => {
    const response = await request(app).delete(`/comments/${commentid}`);

    expect(response.statusCode).toEqual(401);
    expect(typeof response.body).toEqual("object");
    expect(response.body).toHaveProperty("message");
    expect(typeof response.body.message).toEqual("string");
    expect(response.body.message).toEqual("Token not provided!");
  });
});
// afterAll(async () => {});

describe("DELETE /comments/:commentid", () => {
  let restrictedUserToken;
  let userId;

  beforeAll(async () => {
    try {
      // Create a restricted user with limited access
      const restrictedUser = await request(app).post("/users/register").send({
        full_name: "Restricted User",
        email: "restricteduser@gmail.com",
        username: "restricteduser",
        password: "123456789",
        profile_image_url: "https://picsum.photos/id/2/200/200",
        age: 20,
        phone_number: 54321,
      });

      // Login with the restricted user
      const login = await request(app).post("/users/login").send({
        email: "restricteduser@gmail.com",
        password: "123456789",
      });

      // Set the token to the restricted user's token
      restrictedUserToken = login.body.viewUser.token;
      userId = login.body.viewUser.id;
    } catch (error) {
      console.log(error);
    }
  });

  it("should send response with a 403 status code if user doesn't have access to delete comment", async () => {
    const response = await request(app)
      .delete(`/comments/${newcommentid}`)
      .set("token", restrictedUserToken);

    expect(response.statusCode).toEqual(403);
    expect(typeof response.body).toEqual("object");
    expect(response.body).toHaveProperty("message");
    expect(typeof response.body.message).toEqual("string");
    expect(response.body.message).toEqual(
      ` User with id ${userId}  do not have permission with comment id ${newcommentid}`
    );
  });
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Comments", null, {});
  await sequelize.queryInterface.bulkDelete("Photos", null, {});
  await sequelize.queryInterface.bulkDelete("Users", null, {});
});
