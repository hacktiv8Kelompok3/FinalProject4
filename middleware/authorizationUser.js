const { User } = require('../models');

const authorizationUser = async (req, res, next) => { 
    try {
        const UserId = req.params.id
        // console.log(UserId,"<< idnya")
        const authenticatedUser = req.UserData
        // console.log(authenticatedUser,"<< authenticatedUser")
        const user = await User.findOne({
            where: {
                id:UserId
            }
        })
        if (!user) {
            return res.status(404).json({
              name: 'Data Not Found',
              message: `User With id ${UserId} not found`,
            });
        }
        // console.log(authenticatedUser.id,"idnya dari auth");
        if (user.id === authenticatedUser.id) {
          return next();
          console.log('test')
        }
        else {
            return res.status(403).json({
              name: 'Authorization Error',
              message: `id ${authenticatedUser.id} do not have permission with id ${UserId}`,
            });
          }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

module.exports = authorizationUser;