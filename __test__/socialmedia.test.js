const app = require('../app')
const request = require('supertest')
const { generateToken } = require('../helpers/jwt')
const { hashPassword } = require('../helpers/bcrypt.js')
const { SocialMedia, User, Photo } = require('../models')

let token
let UserId

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

    console.log(user);
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



describe("POST /socialmedia/create", () => {
    it("response berhasil membuat socialmedia 200", (done) => {
        request(app)
        .post("/socialmedia/create")
        .send({
            name: "sosmed",
            social_media_url: "https/sosmed.com",
            UserId: UserId
        })
        .set({
            token: token
        })
        .expect(200)
        .end((err,res) => {
            if(err) {
                done(err)
            }

            expect(typeof res.body).toEqual("object")
            expect(res.body).toHaveProperty("id")
            expect(res.body).toHaveProperty("name")
            expect(res.body).toHaveProperty("social_media_url")
            expect(res.body).toHaveProperty("UserId")
            done()
        })
    })

    it("response error harus memiliki token 401", (done) => {
        request(app)
        .post("/socialmedia/create")
        .send({
            name: "sosmedtanpatoken",
            poster_image_url: "https://sosmedtanpatoken.com",
            UserId: UserId
        })
        .expect(401)
        .end((err,res) => {
            if(err) {
                done(err)
            }

            expect(typeof res.body).toEqual("object")
            expect(res.body).toHaveProperty("code")
            expect(res.body).toHaveProperty("message")
            expect(typeof res.body.code).toEqual("number")
            expect(typeof res.body.message).toEqual("string")
            expect(res.body.message).toEqual("Token not provided!")
            expect(res.body.code).toEqual(401)
            done()
        })
    })

    it("response error jika nama kosong 400", (done) => {
        request(app)
        .post("/socialmedia/create")
        .send({
            name: "",
            poster_image_url: "",
            UserId: UserId
        })
        .set({
            token: token
        })
        .expect(400)
        .end((err,res) => {
            if(err) {
                done(err)
            }

            expect(typeof res.body).toEqual("object")
            expect(res.body).toHaveProperty("error")
            expect(typeof res.body.error.name).toEqual("string")
            expect(res.body.error.name).toEqual("Name can't be empty!")
            done()
        })
    })
    
})

describe("GET /socialmedia/", () => {
    it("response berhasil dapat semua data 200", (done) => {
        request(app)
        .get("/socialmedia/")
        .set({
            token: token
        })
        .expect(200)
        .end((err,res) => {
            if(err) {
                done(err)
            }

            expect(typeof res.body).toEqual("object")
            expect(res.body[0]).toHaveProperty("id")
            expect(res.body[0]).toHaveProperty("name")
            expect(res.body[0]).toHaveProperty("social_media_url")
            expect(res.body[0]).toHaveProperty("UserId")
            done()
        })
    })

    it("response error jika tidak ada token 401", (done) => {
        request(app)
        .get("/socialmedia/")
        .expect(401)
        .end((err,res) => {
            if(err) {
                done(err)
            }

            expect(typeof res.body).toEqual("object")
            expect(res.body).toHaveProperty("code")
            expect(res.body).toHaveProperty("message")
            expect(typeof res.body.code).toEqual("number")
            expect(typeof res.body.message).toEqual("string")
            expect(res.body.code).toEqual(401)
            expect(res.body.message).toEqual("Token not provided!")
            done()
        })
    })
})