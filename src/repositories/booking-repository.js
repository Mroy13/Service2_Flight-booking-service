const {}=require('../models');
const crudRepository=require('./crud-repository');
class bookingRepository extends crudRepository{
    constructor(){
        super();
    }
}

module.exports=bookingRepository;