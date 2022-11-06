let chai = require("chai");
let chaiHttp = require("chai-http");
const router = require("../src/index");
const dbClient = require("../src/db/db.connect");
chai.use(chaiHttp);
let should = chai.should();
const jwt = require("jsonwebtoken");
const mongodb = require("mongodb");
const userData_1 = {
  email: "temp1@gmail.com",
  password: "temp12345",
  username: "temp1",
};
const userData_2 = {
  email: "temp2@gmail.com",
  password: "temp2@gmail.com",
  username: "temp2",
};
describe("Clean DB", () => {
  before(async () => {
    const dbConnect = await dbClient();

    await dbConnect.db().dropDatabase();
  });
  it("Create user #1", (done) => {
    chai
      .request(router)
      .post("/api/create_user")
      .set("content-type", "application/json")
      .send(userData_1)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        done();
      });
  });
  it("Create user #2", (done) => {
    chai
      .request(router)
      .post("/api/create_user")
      .set("content-type", "application/json")
      .send(userData_2)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        done();
      });
  });
  it("Authenticate user #1", (done) => {
    chai
      .request(router)
      .post("/api/authenticate")
      .set("content-type", "application/json")
      .send({
        email: userData_1.email,
        password: userData_1.password,
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
  });
  it("User #1 follow User #2", async () => {
    const dbConnect = await dbClient();
    const user1 = await dbConnect
      .db()
      .collection("user")
      .findOne({ email: userData_1.email });

    const user2 = await dbConnect
      .db()
      .collection("user")
      .findOne({ email: userData_2.email });

    const token = jwt.sign(
      {
        email: user1.email,
        _id: user1._id,
      },
      process.env.JWT_SECRET || "",
      { expiresIn: "10d" }
    );

    chai
      .request(router)
      .post(`/api/follow/${user2._id}`)
      .set("content-type", "application/json")
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        //assert.ok(true);
      });
  });
  it("User #1 unfollow User #2", async () => {
    const dbConnect = await dbClient();
    const user1 = await dbConnect
      .db()
      .collection("user")
      .findOne({ email: userData_1.email });

    const user2 = await dbConnect
      .db()
      .collection("user")
      .findOne({ email: userData_2.email });

    const token = jwt.sign(
      {
        email: user1.email,
        _id: user1._id,
      },
      process.env.JWT_SECRET || "",
      { expiresIn: "10d" }
    );

    chai
      .request(router)
      .post(`/api/unfollow/${user2._id}`)
      .set("content-type", "application/json")
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        //assert.ok(true);
      });
  });

  it("Get user #1 profile", async () => {
    const dbConnect = await dbClient();
    const user1 = await dbConnect
      .db()
      .collection("user")
      .findOne({ email: userData_1.email });

    const token = jwt.sign(
      {
        email: user1.email,
        _id: user1._id,
      },
      process.env.JWT_SECRET || "",
      { expiresIn: "10d" }
    );

    chai
      .request(router)
      .get("/api/user")
      .set("content-type", "application/json")
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        //assert.ok(true);
      });
  });
  it("User #1 creates a post", async () => {
    const dbConnect = await dbClient();
    const user1 = await dbConnect
      .db()
      .collection("user")
      .findOne({ email: userData_1.email });

    const token = jwt.sign(
      {
        email: user1.email,
        _id: user1._id,
      },
      process.env.JWT_SECRET || "",
      { expiresIn: "10d" }
    );

    chai
      .request(router)
      .post("/api/posts")
      .set("content-type", "application/json")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        title: "User #1 first post",
        description: "This is user #1 first post",
      })
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        //assert.ok(true);
      });
  });
});
