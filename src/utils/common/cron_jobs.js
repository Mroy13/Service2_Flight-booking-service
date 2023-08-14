var cron = require('node-cron');
const {bookingService}=require('../../services');

function sheduleCrons(){
    
    cron.schedule('*/3 * * * * *', async() => {
        //console.log("inside cron");
     await bookingService.cancelOldbooking();
});
}

module.exports=sheduleCrons;