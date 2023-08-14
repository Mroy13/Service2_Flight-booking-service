const {bookingService}=require('../services');
const StatusCode=require('http-status-codes');
const {SuccessResponse,ErrorResponse}=require('../utils/common');

async function createBooking(req, res) {
    try {
           const bookingInfo = await bookingService.createBooking({
                  flightId:req.body.flightId,
                  userId:req.body.userId,
                  noofSeats:req.body.noofSeats
           });
           SuccessResponse.data = bookingInfo;
           return res
                  .status(StatusCode.CREATED)
                  .json(SuccessResponse);
    }
    catch (error) {

           ErrorResponse.error = error;
           return res
                  .status(error.statusCode)
                  .json(ErrorResponse);
    }


}

async function makePayment(req,res){
       try {
              const paymentInfo = await bookingService.makePayment({
                     bookingId:req.body.bookingId,
                     userId:req.body.userId,
                     totalCost:req.body.totalCost
              });
              SuccessResponse.data = paymentInfo;
              return res
                     .status(StatusCode.CREATED)
                     .json(SuccessResponse);
       }
       catch (error) {
              ErrorResponse.error = error;
              return res
                     .status(error.statusCode)
                     .json(ErrorResponse);
       }
}



module.exports={
       createBooking,
       makePayment
}