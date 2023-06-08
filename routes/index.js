const router = require("express").Router();
const userRouters = require("./user.js");
const photoRouters = require("./photo.js")
const socialMediaRouters = require("./socialmedia")
const commentRouters = require('./comment.js')

router.use('/users',userRouters);
router.use("/photo", photoRouters)
router.use("/socialmedia", socialMediaRouters)
router.use("/comments", commentRouters)


module.exports = router;