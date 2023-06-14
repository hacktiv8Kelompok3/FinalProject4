const app = require('../app')
const request = require('supertest')
const { generateToken } = require('../helpers/jwt')
const { hashPassword } = require('../helpers/bcrypt.js')
const { User, Photo, Comment } = require('../models')

let token 
let UserId
let id
let comment

beforeAll(async () => {
   try {
    const user = await User.create({
        full_name: "admin",
        email: "admin@mail.com",
        username: "admin",
        password: "123456",
        profile_image_url: "www.facebook.com",
        age: 20,
        phone_number: 8437347
   })
    
    token = generateToken({
        id: user.id,
        email: user.email,
        username: user.username
    })

    const photoEdit = await Photo.update({
        title,
        caption,
        poster_image_poster
    })

    id = res.body.id
    
    console.log(token);
   } catch (error) {
    console.log(error);
   }
})

afterAll(async () => {
    try {
        const user = await User.destroy({
            where: {}
        })
    } catch (error) {
        console.log(error);
    }
})

describe("POST /photo/create", () => {
    it("send response 200", (done) => {
        request(app)
        .post("/photo/create")
        .send({
            title: "test",
            caption: "test",
            poster_image_text: "test.com",
            UserId: UserId
        })
        .expect(200)
        .set({
            token: token
        })
        .end((err, res) => {
            if(err) {
                done(err)
            }

            expect(typeof res.body).toEqual("object")
            expect(res.body).toHaveProperty("id")
            expect(res.body).toHaveProperty("title")
            expect(res.body).toHaveProperty("caption")
            expect(res.body).toHaveProperty("poster_image_text")
            expect(res.body).toHaveProperty("UserId")
            expect(res.body.title).toEqual("test")
            expect(res.body.caption).toEqual("test")
            expect(res.body.poster_image_text).toEqual("test.com")
            done()
        })
    })
    
    it("send response error 400", (done) => {
        request(app)
        .post("/photo/create")
        .send({
            title: "",
            caption: "",
            poster_image_text: "" 
        })
        .set({
            token: token
        })
        .expect(400)
        .end((err, res) => {
            if(err) {
                done(err)
            }

            expect(typeof res.body).toEqual("object")
            expect(res.body).toHaveProperty("error")
            expect(typeof res.body.error.title).toEqual("string")
            expect(res.body.error.title).toEqual("kolom tidak boleh kosong")
            done()
        })
    })

    it("send response error URL 400", (done) => {
        request(app)
        .post("/photo/create")
        .send({
            title: "",
            caption: "",
            poster_image_text: "" 
        })
        .set({
            token: token
        })
        .expect(400)
        .end((err, res) => {
            if(err) {
                done(err)
            }

            expect(typeof res.body).toEqual("object")
            expect(res.body).toHaveProperty("error")
            expect(typeof res.body.error.poster_image_text).toEqual("string")
            expect(res.body.error.poster_image_text).toEqual("URL TIDAK BENAR")
            done()
        })
    })
})

describe("GET /photo/", () => {
    it("response 200", (done) => {
        request(app)
        .get("/photo/")
        .set({
            token: token
        })
        .expect(200)
        .end((err, res) => {
            if(err) {
                done(err)
            }

            expect(typeof res.body).toEqual("object")
            expect(res.body[0]).toHaveProperty("id")
            expect(res.body[0]).toHaveProperty("title")
            expect(res.body[0]).toHaveProperty("caption")
            expect(res.body[0]).toHaveProperty("poster_image_text")
            expect(res.body[0]).toHaveProperty("UserId")
            expect(res.body[0]).toHaveProperty("User")
            expect(res.body[0]).toHaveProperty("Comments")
            done()
        })
    })

    it("response error", (done) => {
        request(app)
        .get("/photo/")
        .expect(401)
        .end((err, res) => {
            if(err) {
                done(err)
            }

            expect(typeof res.body).toEqual("object")
            expect(res.body).toHaveProperty("message")
            expect(res.body).toHaveProperty("code")
            expect(typeof res.body.message).toEqual("string")
            expect(typeof res.body.code).toEqual("number")
            expect(res.body.message).toEqual("Token not provided!")
            expect(res.body.code).toEqual(401)
            done()
        })
    })
})

describe("response 200", async () => {
    
})