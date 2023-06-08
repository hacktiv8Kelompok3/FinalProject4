const router = require("express").Router()
const photo = require("../controllers/photocontroller")
const authentication = require("../middleware/authentication")
const authorizationPhoto = require('../middleware/authorizationPhoto')

router.use(authentication)

router.get("/", photo.getAllPhoto)
router.post("/create", photo.createPhoto)
router.delete("/:id", authorizationPhoto,photo.deletePhoto)
router.put("/:id", authorizationPhoto,photo.updatePhoto)

module.exports = router