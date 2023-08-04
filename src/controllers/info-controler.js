const { StatusCodes } = require('http-status-codes');
const {SuccessResponse,ErrorResponse}=require('../utils/common');

function info(req,res){
    SuccessResponse.message="API is live";
    return res.status(StatusCodes.OK).json(SuccessResponse);
}
module.exports={ info

                     }                      