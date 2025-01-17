import asyncMiddleware from '~/server/middlewares/response/async-middleware.js';
import { sequelizeConfig } from '../../../lib/sequelize.js';
import db from '~/server/models/index.js';
const { Reservations, Sequelize } = db;
const { Company } = db;
import express from 'express';
import { Op } from 'sequelize';
import moment from 'moment';

const router = express.Router();

router
    .route('/revenue-count-rating')
    .get(
        // [hasPermission()],
        asyncMiddleware(async(req,res)=>{
            const {companyId} = req.body;

            if(!companyId){
              return res.status(400).json({message:'companyId is required'})
            }

            const {reservationCount,revenue} = await Reservations.findAndCountAll({
                where:{
                    companyId: companyId,
                    status:{
                        [Op.like] : 'completed'
                    }
                },
                attributes: [
                    [Sequelize.fn('SUM', Sequelize.col('amount')), 'revenue'], 
                ],
            })
            const rating = await Company.findAll({
              attributes:['rating'],
              where:{
                companyId: companyId,
              }
            })
            
            return res.http200({reservationCount,revenue,rating});
    }))

// router
//     .route("revenue-rating")
//     .get(
//       asyncMiddleware(async (req,res)=>{
//         const {count,rows} = await Reservations.findAndCountAll({
//           where:{
//               status:{
//                   [Op.like] : 'completed'
//               }
//           },
//           attributes: [
//               [Sequelize.fn('SUM', Sequelize.col('amount')), 'revenue'], 
//           ],
//           include: [
//             {
//                 model: UserFeedbacks, 
//                 attributes: [
//                     [Sequelize.fn('AVG', Sequelize.col('rating')), 'rating'], 
//                 ],
//             },
//         ],
//       })

//         return res.http200({count,rows});
//       })
//     )

router
    .route('/reservation-count-daily')
    .get(
        asyncMiddleware(async (req, res) => {

            const currentDate = moment().format("YYYY-MM-DD");
            const nextDate = moment().add(1, 'days').format("YYYY-MM-DD");
            console.log(currentDate,nextDate)
            const { count, rows } = await Reservations.findAndCountAll({
                where: {
                    
                    status: {
                        [Op.eq]: "completed"
                    },
                    createdAt: {
                        [Op.gte]: currentDate,  
                        [Op.lt]: nextDate       
                    }
                }
            });
            console.log("from api this is the data: ", rows)
            return res.http200({ count, rows });
        }) 
    );

router
    .route('/reservation-count-weekly')
    .get(
        asyncMiddleware(async (req, res) => {

            const currentDate = moment().format("YYYY-MM-DD");
            const nextDate = moment().subtract(6, 'days').format("YYYY-MM-DD");
            console.log(nextDate,currentDate)
            const { count, rows } = await Reservations.findAndCountAll({
                where: {
                    
                    status: {
                        [Op.eq]: "completed"
                    },
                    createdAt: {
                        [Op.lte]: currentDate,  
                        [Op.gt]: nextDate
                    }
                }
            });
            // console.log("from api this is the data: ", rows)
            return res.http200({ count, rows });
        })
    );


    export default router;
