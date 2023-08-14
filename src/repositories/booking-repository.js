const { Booking } = require('../models');
const crudRepository = require('./crud-repository');
class bookingRepository extends crudRepository {
    constructor() {
        super(Booking);
    }
    async createBooking(data, t) {
        try {
            const response = await Booking.create(data, { transaction: t });
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async getBooking(id,t) {
        try {
           const response = await Booking.findByPk(id,{ transaction: t });
            return response;
        }
        catch (error) {
            throw error;
        }
    }

    async updateBooking(id,data,t) {
        try {
            const response = await Booking.update(data, {

                where: {
                    id: id
                }
            }, { transaction: t });
        }
        catch (error) {
            throw error;
        }
    }

}

module.exports = bookingRepository;