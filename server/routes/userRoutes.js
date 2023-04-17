const { regCtrl ,logCtrl, getAllUsers,profCtrl, statusCtrl,logoutCtrl,activeCtrl,searchFreinds, addFreinds, getUserData, blockedUsers,removeBlocked} = require("../controllers/userController");
const {getAllUsersDet,deleteUser} = require("../controllers/adminController")
const {sendFbCtrl,getFbCtrl} =require("../controllers/fbController");
const router=require("express").Router();

router.post("/register",regCtrl);
router.post("/login",logCtrl);
router.post("/setProfile",profCtrl);
router.post("/onlineUsers",statusCtrl);
router.get('/allUsers/:id',getAllUsers);
router.post("/activeUsers",logoutCtrl);
router.get("/actives",activeCtrl);
router.post("/searchFriends",searchFreinds);
router.post("/addFriends",addFreinds);
router.post("/getUserData",getUserData);
router.post("/getAllUsersDet",getAllUsersDet);
router.post("/sendfb",sendFbCtrl);
router.post("/getfb",getFbCtrl);
router.post("/blockUser",blockedUsers);
router.post("/unblockUser",removeBlocked);
router.post("/deleteUser",deleteUser);

module.exports = router