const {Booking}=require('../models');
const crudRepository=require('./crud-repository');
class bookingRepository extends crudRepository{
    constructor(){
        super();
    }
    async createBooking(data,t){
        try{
          const response=await Booking.create(data,{transaction:t});
          return response;
        }catch(error){
            console.log(error);
            throw error;
        }
    }
}

module.exports=bookingRepository;