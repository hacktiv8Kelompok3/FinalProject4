const { Photo } = require('../models')

const authorizationComment = async (req, res, next) => {
 
    try {
        
        const PhotoId = req.params.id
        const UserId = req.UserData.id
        const photo = await Photo.findOne({
            where: {
                id: PhotoId
            }
        })

        console.log(photo);

        if (!photo) {
            return res.status(404).json({
                name : "Data not found",
                message : `Photo with id ${PhotoId} not found`
            })
        }

        if (photo.UserId === UserId){
            return next()
        } else {
            return res.status(403).json({
                name : 'Authorization error',
                message : ` User with id ${UserId}  do not have permission with comment id ${PhotoId}`
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }

}

module.exports = authorizationComment