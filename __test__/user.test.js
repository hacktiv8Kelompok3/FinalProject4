const app = require('../app')
const request = require('supertest')
const { generateToken } = require('../helpers/jwt')
const { hashPassword } = require('../helpers/bcrypt.js')
const { sequelize } = require('../models')



const UserData = {
    full_name: 'User',
    email: 'user@gmail.com',
    username: 'user',
    password: '123456789',
    profile_image_url: 'https://picsum.photos/id/1/200/200',
    age: 19,
    phone_number: 12345,
  };
      
let token
let userId
let userIdx
    
    
describe('POST /users/register', () => { 
    it('should send response with a 201 status code', async () => {
        const res = await request(app).post("/users/register").send(UserData)
        expect(res.statusCode).toEqual(201)
        expect(typeof res.body).toEqual('object')
        expect(res.body).toHaveProperty('id')
        expect(res.body).toHaveProperty('full_name')
        expect(res.body).toHaveProperty('email')
        expect(res.body).toHaveProperty('username')
        expect(res.body).toHaveProperty('profile_image_url')
        expect(res.body).toHaveProperty('age')
        expect(res.body).toHaveProperty('phone_number')
        userIdx = res.body.id
        console.log(userIdx,'<< id ke dua')
    })
    it("should return 500 status code if the email is already registered", async () => { 
        const res = await request(app).post("/users/register").send(UserData)
        expect(res.statusCode).toEqual(500)
        expect(typeof res.body).toEqual('object')
        expect(res.body).toHaveProperty('error')
        expect(typeof res.body.error.email).toEqual('string')
        expect(res.body.error.email).toEqual("Email already use!")
    })
})

describe('POST /users/login', () => { 
    it("should return 200 status code if the user is successfully logged in", async () => { 
        const res = await request(app)
            .post("/users/login")
            .send({ email: UserData.email, password: UserData.password })
        expect(res.statusCode).toEqual(200)
        expect(typeof res.body).toEqual("object")
        expect(res.body.viewUser).toHaveProperty("id")
        expect(res.body.viewUser).toHaveProperty("token")
        expect(typeof res.body.viewUser.token).toEqual("string")
    })
    it("should return 400 status code if the user is not registered", async () => { 
        const res = await request(app)
            .post("/users/login")
            .send({ email: 'fail@gmail.com', password: 'siapa' })
        expect(res.statusCode).toEqual(400)
        expect(typeof res.body).toEqual("object")
        expect(res.body).toHaveProperty("message")
        expect(typeof res.body.message).toEqual("string")
        expect(res.body.message).toEqual("User not found")
    })
})

const UserInsert = {
    full_name: 'before',
    email: 'before@gmail.com',
    username: 'before',
    password: '123456',
    profile_image_url: 'www.google.com',
    age: 19,
    phone_number: 82133582397,
}

beforeAll(async () => { 
    try {
        const userRegister = await request(app)
            .post('/users/register')
            .send(UserInsert)
        const userLogin = await request(app)
            .post('/users/login')
            .send({
                email: 'before@gmail.com',
                password: '123456'
            })
        token = userLogin.body.viewUser.token
        userId = userLogin.body.viewUser.id
        console.log(userId, '<< id pertama')
        console.log(token)
    } catch (error) {
        console.log(error)
    }
})

const UserUpdate = {
    full_name: 'after',
    email: 'after@gmail.com',
    username: 'after',
    password: '123456',
    profile_image_url: 'www.google.com',
    age: 19,
    phone_number: 82133582397,
}

describe("PUT /users/:id", () => { 
    it("should return 200 status code if the user is successfully updated", async () => { 
        const res = await request(app)
            .put(`/users/${userId}`)
            .set('token', token)
            .send(UserUpdate.username)
        expect(res.statusCode).toEqual(200)
        expect(typeof res.body).toEqual('object')
        expect(res.body).toHaveProperty('email')
        expect(res.body).toHaveProperty('full_name')
        expect(res.body).toHaveProperty('username')
        expect(res.body).toHaveProperty('profile_image_url')
        expect(res.body).toHaveProperty('age')
        expect(res.body).toHaveProperty('phone_number')
    })

    it("should return 401 status code if there is no authentication", async () => { 
        const res = await request(app).put(`/users/${userId}`).send(UserUpdate.username)
        expect(res.statusCode).toEqual(401)
        expect(typeof res.body).toEqual('object')
        expect(res.body).toHaveProperty("message")
        expect(typeof res.body.message).toEqual("string")
        expect(res.body.message).toEqual("Token not provided!")
    })

    it("should return 403 status code if the user is not authorized", async () => { 
        const res = await request(app).put(`/users/${userIdx}`).set("token", token).send(UserUpdate.username)
        expect(res.statusCode).toEqual(403)
        expect(typeof res.body).toEqual("object")
        expect(res.body).toHaveProperty("message")
        expect(typeof res.body.message).toEqual("string")
        expect(res.body.message).toEqual(`id ${userId} do not have permission with id ${userIdx}`)
    })
})

describe("DELETE /users/:id", () => { 
    it("should return 401 status code if there is no authentication", async () => { 
        const res = await request(app).delete(`/users/${userId}`)
        expect(res.statusCode).toEqual(401)
        expect(typeof res.body).toEqual("object")
        expect(res.body).toHaveProperty("message")
        expect(typeof res.body.message).toEqual("string")
        expect(res.body.message).toEqual("Token not provided!")
    })

    it("should return 401 status code if the user is not authorized", async () => { 
        const res = await request(app).delete(`/users/${userIdx}`).set("token",token)
        expect(res.statusCode).toEqual(403)
        expect(typeof res.body).toEqual("object")
        expect(res.body).toHaveProperty("message")
        expect(typeof res.body.message).toEqual("string")
        expect(res.body.message).toEqual(`id ${userId} do not have permission with id ${userIdx}`)
    })

    it("should return 200 status code if the user is successfully deleted", async () => { 
        const res = await request(app).delete(`/users/${userId}`).set("token", token)
        expect(res.statusCode).toEqual(200)
        expect(typeof res.body).toEqual("object")
        expect(res.body).toHaveProperty("message")
        expect(typeof res.body.message).toEqual("string")
        expect(res.body.message).toEqual(`Delete id ${userId} success!`)
    })
})

afterAll(async () => {
    await sequelize.queryInterface.bulkDelete("Users", null, {});
  });

