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



module.exports={
       createBooking
}