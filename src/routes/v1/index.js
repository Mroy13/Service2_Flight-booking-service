const express=require('express');
const { infoController} = require('../../controllers');
const bookingRoutes=require('./booking-routes');
const router=express.Router();
router.use('/booking',bookingRoutes);
router.get('/info',infoController.info);
module.exports=router;
