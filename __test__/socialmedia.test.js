const app = require('../app')
const request = require('supertest')
const { generateToken } = require('../helpers/jwt')
const { hashPassword } = require('../helpers/bcrypt.js')
const { SocialMedia, User, Photo } = require('../models')

let token
let UserId
let newToken
let SosmedId
let newSosmedId

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
    
    UserId = user.id
       
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
       
    const newSosmed = await SocialMedia.create({
        name: "another",
        social_media_url: "another.com",
        UserId: newUser.id
    })

    newSosmedId = newSosmed.id

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
            SosmedId = res.body.id
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

describe("PUT /socialmedia/:socialMediaId", () => { 
    it("should return status 200 if social media is updated successfully", async () => { 
        const updateData = {
            name: "baru",
            social_media_url: "baru",
        }
        const res = await request(app)
            .put(`/socialmedia/${SosmedId}`)
            .send(updateData)
            .set("token", token)
        expect(res.statusCode).toEqual(200)
        expect(typeof res.body).toEqual("object")
        expect(res.body).toHaveProperty("social_media")
        expect(res.body.social_media).toHaveProperty("id")
        expect(res.body.social_media).toHaveProperty("name")
        expect(res.body.social_media).toHaveProperty("social_media_url")
        expect(res.body.social_media).toHaveProperty("UserId")
    })

    it("should return status 401 if there is no authentication", async () => { 
        const res = await request(app)
            .put(`/socialmedia/${SosmedId}`)
            .send({ name: "error", social_media_url: "error.com" })
        
        expect(res.statusCode).toEqual(401)
        expect(typeof res.body).toEqual("object")
        expect(res.body).toHaveProperty("code")
        expect(res.body).toHaveProperty("message")
        expect(typeof res.body.message).toEqual("string")
        expect(res.body.message).toEqual("Token not provided!")
    })

    it("should return status 401 if the user is not authorized", async () => { 
        const res = await request(app)
            .put(`/socialmedia/${newSosmedId}`)
            .send({ name: "error", social_media_url: "error.com" })
            .set("token", token)
        expect(res.statusCode).toEqual(403)
        expect(typeof res.body).toEqual("object")
        expect(res.body).toHaveProperty("name")
        expect(res.body).toHaveProperty("message")
        expect(typeof res.body.message).toEqual("string")
        expect(res.body.message).toEqual(` User with id ${UserId}  do not have permission with sosmed user id ${newSosmedId}`)

    }) 

    it("should return status 404 if social media is not found", async () => { 
        const res = await request(app)
            .put(`/socialmedia/${SosmedId+2}`)
            .send({ name: "error", social_media_url: "error.com" })
            .set("token", token)
        console.log(res, 'resnya')
        expect(res.statusCode).toEqual(404)
        expect(typeof res.body).toEqual("object")
        expect(res.body).toHaveProperty("name")
        expect(res.body).toHaveProperty("message")
        expect(typeof res.body.message).toEqual("string")
        expect(res.body.message).toEqual(`Photo with id ${SosmedId+2} not found`)

    })
})

describe("DELETE /socialmedia/:socialMediaId", () => { 
    it("should return status 401 if there is no authentication", async () => { 
        const res = await request(app)
            .delete(`/socialmedia/${SosmedId}`)
            
        expect(res.statusCode).toEqual(401)
        expect(typeof res.body).toEqual("object")
        expect(res.body).toHaveProperty("code")
        expect(res.body).toHaveProperty("message")
        expect(typeof res.body.message).toEqual("string")
        expect(res.body.message).toEqual(`Token not provided!`)
    })
    it("should return status 401 if the user is not authorized", async () => { 
        const res = await request(app)
            .delete(`/socialmedia/${newSosmedId}`)
            .set("token", token)
        
        expect(res.statusCode).toEqual(403)
        expect(typeof res.body).toEqual("object")
        expect(res.body).toHaveProperty("name")
        expect(res.body).toHaveProperty("message")
        expect(typeof res.body.message).toEqual("string")
        expect(res.body.message).toEqual(` User with id ${UserId}  do not have permission with sosmed user id ${newSosmedId}`)
    })
    it("should return status 404 if social media is not found", async () => { 
        const res = await request(app)
            .delete(`/socialmedia/${SosmedId+2}`)
            .set("token", token)
        
        expect(res.statusCode).toEqual(404)
        expect(typeof res.body).toEqual("object")
        expect(res.body).toHaveProperty("name")
        expect(res.body).toHaveProperty("message")
        expect(typeof res.body.message).toEqual("string")
        expect(res.body.message).toEqual(`Photo with id ${SosmedId+2} not found`)

    })
    it("should return status 200 if social media is deleted successfully", async () => { 
        const res = await request(app)
            .delete(`/socialmedia/${SosmedId}`)
            .set("token", token)
        
        expect(res.statusCode).toEqual(200)
        expect(typeof res.body).toEqual("object")
        expect(res.body).toHaveProperty("message")
        expect(typeof res.body.message).toEqual("string")
        expect(res.body.message).toEqual(`Data ${SosmedId} Berhasil di hapus`)
    })
})


