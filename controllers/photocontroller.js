const { Photo, User,Comment } = require("../models")

class photoController {
    static async getAllPhoto(req, res) {
        try {
            const { id } = req.UserData
            console.log(id);
            
            const data = await Photo.findAll({
                where: {
                    UserId: id
                }, 
                include: [
                    {
                        model: User,
                        attributes: ['id', 'username', 'profile_image_url'],
                    },
                    {
                        model: Comment,
                        attributes: ['comment'],
                        include: [{ model: User, attributes: ['username'] }]
                    }
                ]
            })

            res.status(200).json(data)
        } catch (error) {
            res.status(400).json(error)
            console.log(error);
        }
    }

    static async createPhoto(req, res) {
        try {
            const {
            title,
            caption,
            poster_image_text,
        } = req.body
        const { id } = req.UserData

        const data = await Photo.create({
            title,
            caption,
            poster_image_text,
            UserId: id
        })
        if(!data) {
            throw {
                code: 404,
                message: "tidak boleh kosong!!"
            }
        }

        const response = {
            id: data.id,
            title: data.title,
            caption: data.caption,
            poster_image_text: data.poster_image_text,
            UserId: id
        }
            

        res.status(200).send(response)
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                const validasiErorr = {};
                error.errors.map((er) => {
                    validasiErorr[er.path] = er.message;
                });
                return res.status(400).json({"error":validasiErorr});
            }else{
                res.status(error?.code || 500).json(error)
            }
        }
    }

    static async deletePhoto(req, res) {
        try {
            const { id } = req.params
            console.log(id);

            const data = await Photo.destroy({
                where: {
                    id
                }
            })

            if(!data) {
                throw {
                    code: 404,
                    message: "data tidak ditemukan"
                }
            }

            res.status(200).json({
                code: 200,
                message:`Delete photo Id ${id} success!`})
        } catch (error) {
            res.status(404).json(error)
            console.log(error);
        }
    }

    static async updatePhoto(req, res) {
        try {
            const { id } = req.params

            const { 
                title,
                caption,
                poster_image_text
            } = req.body

            const data = await Photo.update({
                title,
                caption,
                poster_image_text,
                updated_at: new Date()
            }, {
                where: {
                    id
                }, 
                returning: true
            })
            const userView = {
                id:data[1][0].id,
                title: data[1][0].title,
                caption: data[1][0].caption,
                poster_image_text: data[1][0].poster_image_text,
                UserId: data[1][0].UserId,
                createdAt: data[1][0].createdAt,
                updatedAt: data[1][0].updatedAt
            }

            res.status(200).json({"photo":userView})
        } catch (error) {
            res.status(400).json(error)
        }
    }
}

module.exports = photoController