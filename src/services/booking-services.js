const StatusCode=require('http-status-codes');
const {bookingRepository}=require('../repositories');
const db=require('../models');
const axios=require('axios');
const Apperror=require('../utils/error/App-error');
const {ServerConfig}=require('../config');

const BookingRepository=new bookingRepository()
async function createBooking(data){
      const t=await db.sequelize.transaction();
      try{
      const flightDetails=await axios.get(`${ServerConfig.host_port}/api/v1/flights/${data.flightId}`)
     // console.log(flightDetails.data.data);
      const flightData=flightDetails.data.data;
      if(flightData.totalSeats<data.noofSeats){
        throw new Apperror("noofseats is greater than total seats",StatusCode.BAD_REQUEST);
      }
      const totalCost=flightData.price * data.noofSeats;
      data.totalCost=totalCost.toString();// const bookingData = {...data, totalCost: totalCost};
      //console.log(data);
      const booking=await BookingRepository.createBooking(data,t);
      await axios.patch(`${ServerConfig.host_port}/api/v1/flights/${data.flightId}/seats`,{
        seats:data.noofSeats,
      })
        t.commit();
        return booking;
      }
      catch(error){
        t.rollback()
       // console.log(error);
        throw error;
      }
}

module.exports={
        createBooking,  
}