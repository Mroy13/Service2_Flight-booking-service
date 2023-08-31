const express=require('express');
 const routes=require('./routes');
 const {ServerConfig,queueConfig}=require('./config');
 const CRON_JOBS=require('./utils/common/cron_jobs');

 const app=express();
 app.use(express.json());
 app.use(express.urlencoded({extended: true}));

 app.use('/api',routes);
// app.use('/bookingservice/api',routes);
 app.listen(ServerConfig.PORT,async()=>{
   console.log(`server is up at port no ${ServerConfig.PORT}`);
   await queueConfig.connectQueue();
  // await queueConfig.sendData({message:`booking Successfull for booking id 3`});
   console.log("connect to queue");
   //CRON_JOBS();
 })
