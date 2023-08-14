const express=require('express');
 const routes=require('./routes');
 const {ServerConfig}=require('./config');
 const CRON_JOBS=require('./utils/common/cron_jobs');

 const app=express();
 app.use(express.json());
 app.use(express.urlencoded({extended: true}));
 app.use('/api',routes);
 app.listen(ServerConfig.PORT,()=>{
   console.log(`server is up at port no ${ServerConfig.PORT}`);
   CRON_JOBS();
 })
