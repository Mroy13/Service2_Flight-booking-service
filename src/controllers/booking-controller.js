const { bookingService } = require('../services');
const StatusCode = require('http-status-codes');
const { SuccessResponse, ErrorResponse } = require('../utils/common');
const Apperror = require('../utils/error/App-error');

const inmDbmap = {};


async function createBooking(req, res) {
       try {
              const bookingInfo = await bookingService.createBooking({
                     flightId: req.body.flightId,
                     userId: req.body.userId,
                     noofSeats: req.body.noofSeats
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

async function makePayment(req, res) {
       try {
              // Added idempotency in payment api
              const idemppotentKey = req.headers['x-idempotent-key'];
              console.log(idemppotentKey);
              if (!idemppotentKey) {
                     return res
                            .status(StatusCode.BAD_REQUEST)
                            .json({ meassage: ["idempotent key not present"] });
                     // throw new Apperror("idempotent key not present",StatusCode.BAD_REQUEST);
              }

              if (idemppotentKey == inmDbmap[idemppotentKey]) {
                     return res
                            .status(StatusCode.BAD_REQUEST)
                            .json({ meassage: ["duplicate request for successful order"] });
                     //throw new Apperror("duplicate request for successful order",StatusCode.BAD_REQUEST);
              }
              const paymentInfo = await bookingService.makePayment({
                     bookingId: req.body.bookingId,
                     userId: req.body.userId,
                     totalCost: req.body.totalCost
              });
              inmDbmap[idemppotentKey] = idemppotentKey;
              SuccessResponse.data = paymentInfo;
              return res
                     .status(StatusCode.CREATED)
                     .json(SuccessResponse);
       }
       catch (error) {
              console.log(inmDbmap);
              ErrorResponse.error = error;
              return res
                     .status(error.statusCode)
                     .json(ErrorResponse);
       }
}



module.exports = {
       createBooking,
       makePayment
}