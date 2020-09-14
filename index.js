const moment = require("moment")
const Sequelize = require('sequelize');



const config = {
 dialect: 'mysql',
 database: 'erp',
 username: 'http_procol',
 password: 'mYcUd@B',
 host: 'inergy-development-temporary.ciyxcchq3tgs.eu-west-1.rds.amazonaws.com',
 pool: {
  max: 5,
  min: 0,
  acquire: 30000,
  idle: 10000
 }
}

const formatDate = (date) => {
 date = moment(date, "YYYYMMDDHHmm").toISOString()
 return date
}

const updateDate = (meterId, paymentDate) => {
 const database = new Sequelize(config)

 const updateQuery = `UPDATE mc_logsoutgoing SET status = 'Delivered' WHERE meter_no = '${meterId}' AND DATEDIFF(sent_on, '${paymentDate}') = 0`

 return new Promise((resolve, reject) => {
  database.query(updateQuery).then((result) => {
   resolve(resolve)
  }).catch((error) => reject(error))
 })
}

exports.handler = async(event, context) => {
 //console.log('Received event:', JSON.stringify(event, null, 2));

 // console.log(formatDate(date).slice(0, 19).replace('T', ' '))

 for (const record of event.Records) {
  console.log(record.eventID);
  console.log(record.eventName);
  // console.log('DynamoDB Record: %j', record.dynamodb);
  const newRecord = record.dynamodb.NewImage
  console.log(newRecord)

  const paymentDate = formatDate(newRecord.paymentDate["S"]).slice(0, 19).replace('T', ' ')
  const meterID = newRecord.meterID["S"]

  newRecord.isRead["BOOL"] && await updateDate(meterID, paymentDate).then(result => console.log(result)).catch(error => console.log(error))
 }
 return `Successfully processed ${event.Records.length} records.`;
};
