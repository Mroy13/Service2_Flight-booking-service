const express=require('express');
const {bookingController}=require ('../../controllers');
//const {bookingMiddleware}=require('../../middlewares');
const router=express.Router();
router.post('/',bookingController.createBooking);
router.get('/',);
router.get('/:id',);
module.exports=router