const app = require('../app')
const request = require('supertest')
const { generateToken } = require('../helpers/jwt')
const { hashPassword } = require('../helpers/bcrypt.js')
const { User, Photo, Comment } = require('../models')

let token 
let newToken
let UserId
let id
let newId

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
       
    const newUser = await User.create({
        full_name: "new",
        email: "new@mail.com",
        username: "new",
        password: "123456",
        profile_image_url: "www.facebook.com",
        age: 20,
        phone_number: 8437347
    })
       
    newToken = generateToken({
        id: newUser.id,
        email: newUser.email,
        username: newUser.username
    })
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
            UserId = res.body.UserId
            id = res.body.id
            console.log(res.body,'old user res bodi')
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

    it("send response 200 another user", (done) => {
        request(app)
        .post("/photo/create")
        .send({
            title: "xxx",
            caption: "xxx",
            poster_image_text: "xxx.com",
            UserId: UserId
        })
        .expect(200)
        .set({
            token: newToken
        })
        .end((err, res) => {
            if(err) {
                done(err)
            }
            newId = res.body.id
            console.log(res.body,'new user res bodi')
            expect(typeof res.body).toEqual("object")
            expect(res.body).toHaveProperty("id")
            expect(res.body).toHaveProperty("title")
            expect(res.body).toHaveProperty("caption")
            expect(res.body).toHaveProperty("poster_image_text")
            expect(res.body).toHaveProperty("UserId")
            expect(res.body.title).toEqual("xxx")
            expect(res.body.caption).toEqual("xxx")
            expect(res.body.poster_image_text).toEqual("xxx.com")
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

describe("PUT /photos/:photoId", () => { 
    it("should update a photo and return status 200", async () => { 
        const updatePhoto = {
            title: "Updated Photo",
            caption: "This photo has been updated",
            poster_image_url: "www.google.com",
        }
        const res = await request(app)
            .put(`/photo/${id}`)
            .send(updatePhoto)
            .set("token", token)
        
        expect(res.statusCode).toEqual(200)
        expect(res.body.photo).toHaveProperty("id")
        expect(res.body.photo).toHaveProperty("title")
        expect(res.body.photo).toHaveProperty("caption")
        expect(res.body.photo).toHaveProperty("poster_image_text")
        expect(res.body.photo).toHaveProperty("UserId")

    })

    it("should return status 401 if there is no authentication", async () => { 
        const updatePhoto = {
            title: "Updated Photo",
            caption: "This photo has been updated",
            poster_image_url: "www.google.com",
        }
        const res = await request(app)
            .put(`/photo/${id}`)
            .send(updatePhoto)
        
        
        expect(res.statusCode).toEqual(401)
        expect(typeof res.body).toEqual("object")
        expect(res.body).toHaveProperty("message")
        expect(typeof res.body.message,).toEqual("string")
        expect(res.body.message).toEqual("Token not provided!")

    })

    it("should return status 404 if photo is not found", async () => { 
        const updatePhoto = {
            title: "Updated Photo",
            caption: "This photo has been updated",
            poster_image_url: "www.google.com",
        }
        const res = await request(app)
            .put(`/photo/${id+2}`)
            .send(updatePhoto)
            .set("token", token)
        
        expect(res.statusCode).toEqual(404)
        expect(typeof res.body).toEqual("object")
        expect(res.body).toHaveProperty("name")
        expect(res.body).toHaveProperty("message")
        expect(typeof res.body.message,).toEqual("string")
        expect(res.body.message).toEqual(`Photo with id ${id+2} not found`)
        
    })
})

describe("DELETE /photos/:photoId", () => { 
    it("should delete a photo and return status 200", async () => { 
        const res = await request(app)
            .delete(`/photo/${id}`)
            .set("token", token)

        expect(res.statusCode).toEqual(200)
        expect(typeof res.body).toEqual("object")
        expect(res.body).toHaveProperty("message")
        expect(typeof res.body.message,).toEqual("string")
        expect(res.body.message).toEqual(`Delete photo Id ${id} success!`)

    })

    it("should return status 401 if there is no authentication", async () => { 
        const res = await request(app)
            .delete(`/photo/${id}`)
        
        expect(res.statusCode).toEqual(401)
        expect(typeof res.body).toEqual("object")
        expect(res.body).toHaveProperty("code")
        expect(res.body).toHaveProperty("message")
        expect(typeof res.body.message,).toEqual("string")
        expect(res.body.message).toEqual(`Token not provided!`)
    })

    it("should return 403 status code if the photo is not owned by the user", async () => { 
        const res = await request(app)
            .delete(`/photo/${newId}`)
            .set("token", token)

        expect(res.statusCode).toEqual(403)
        expect(typeof res.body).toEqual("object")
        expect(res.body).toHaveProperty("name")
        expect(res.body).toHaveProperty("message")
        expect(typeof res.body.message,).toEqual("string")
        expect(res.body.message).toEqual(` User with id ${UserId}  do not have permission with comment id ${newId}`)

    })
    it("should return 404 status code if the photo is not found", async () => { 
        const res = await request(app).delete(`/photo/${id+2}`).set("token", token)

        expect(res.statusCode).toEqual(404)
        expect(typeof res.body).toEqual("object")
        expect(res.body).toHaveProperty("name")
        expect(res.body).toHaveProperty("message")
        expect(typeof res.body.message,).toEqual("string")
        expect(res.body.message).toEqual(`Photo with id ${id+2} not found`)
    })
})