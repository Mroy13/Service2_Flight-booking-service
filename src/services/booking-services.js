const StatusCode = require('http-status-codes');
const { bookingRepository } = require('../repositories');
const db = require('../models');
const axios = require('axios');
const Apperror = require('../utils/error/App-error');
const { ServerConfig } = require('../config');
const { Enums } = require('../utils/common');
const { BOOKED, CANCELLED } = Enums.BOOKING_STATUS;

const BookingRepository = new bookingRepository()
async function createBooking(data) {
  const t = await db.sequelize.transaction();
  try {
    const flightDetails = await axios.get(`${ServerConfig.host_port}/api/v1/flights/${data.flightId}`)
    //console.log(flightDetails.data.data);
    const flightData = flightDetails.data.data;
    if (flightData.totalSeats < data.noofSeats) {
      throw new Apperror("noofseats is greater than total seats", StatusCode.BAD_REQUEST);
    }
    const totalCost = flightData.price * data.noofSeats;
    data.totalCost = totalCost.toString();// const bookingData = {...data, totalCost: totalCost};
    //console.log(data);
    const booking = await BookingRepository.createBooking(data, t);
    await axios.patch(`${ServerConfig.host_port}/api/v1/flights/${data.flightId}/seats`, {
      seats: data.noofSeats,
    })
    await t.commit();
    return booking;
  }
  catch (error) {
    await t.rollback();
   // console.log(error);
    throw error;
  }
}


async function makePayment(data) {
  const t = await db.sequelize.transaction();
  try {
    const bookingDetails = await BookingRepository.getBooking(data.bookingId, t);


    if (bookingDetails.status == CANCELLED) {
      throw new Apperror("The booking has cancelled", StatusCode.BAD_REQUEST);
    }
    if (bookingDetails.status == BOOKED) {
      throw new Apperror("already completed the booking", StatusCode.BAD_REQUEST);
    }

    const bookingTime = new Date(bookingDetails.createdAt).getTime();
    const currentTime = new Date().getTime();
    if (currentTime - bookingTime > 300000) {
      await cancelBokking(bookingDetails.id);
      throw new Apperror("The booking has expired", StatusCode.BAD_REQUEST);
    }


    if (bookingDetails.totalCost != data.totalCost) {
      throw new Apperror("total cost does not match", StatusCode.BAD_REQUEST);
    }
    if (bookingDetails.userId != data.userId) {
      throw new Apperror("invalid userid", StatusCode.BAD_REQUEST);
    }
    await BookingRepository.updateBooking(data.bookingId, { status: BOOKED }, { transaction: t });
    const bookingDetails1 = await BookingRepository.getBooking(data.bookingId);
    await t.commit();
    return bookingDetails1;

  } catch (error) {
   // console.log(error);
    await t.rollback();
    throw error;
  }
}


async function cancelBokking(bookingId) {
  const t = await db.sequelize.transaction();
  try {
    const bookingDetails = await BookingRepository.getBooking(bookingId, t);

    if(bookingDetails.status==CANCELLED){  //?
      await t.commit();
      return true;
    }

    await axios.patch(`${ServerConfig.host_port}/api/v1/flights/${bookingDetails.flightId}/seats`, {
      seats: bookingDetails.noofSeats,
      dec:0
    });
    await BookingRepository.updateBooking(bookingId, { status: CANCELLED }, { transaction: t });
    await t.commit();
  } catch (error) {
    //console.log(error);
    await t.rollback()
    throw error;
  }
}

async function cancelOldbooking(){
    const dateTime=new Date(Date.now()-5*60*1000);
    try {
      const response=await BookingRepository.cancelOldbooking(dateTime);
      return response;
    } catch (error) {
      throw error;
    }
}

module.exports = {
  createBooking,
  makePayment,
  cancelOldbooking
}