const { client } = require("../database-config/database");

class sql_helper_charts {
  static region_wise_offence_count (cb) {
    client.query(
      `SELECT region,COUNT(offence_id) FROM OFFENCE NATURAL JOIN location GROUP BY region`,
      
      (err, results) => {
        if (err) {
          console.log(err);
        }
        
        return cb(undefined, results.rows);
      }
    );
  }

  static victim_gender_wise_offence_count (cb) {
    client.query(
      `SELECT victim_gender, COUNT(offence_id) FROM OFFENCE NATURAL JOIN victim GROUP BY victim_gender`,
      
      (err, results) => {
        if (err) {
          console.log(err);
        }
        
        return cb(undefined, results.rows);
      }
    );
  }

static offender_gender_wise_offence_count (cb) {
  client.query(
    `SELECT offender_gender, COUNT(offence_id) FROM OFFENCE NATURAL JOIN offender GROUP BY offender_gender`,
    
    (err, results) => {
      if (err) {
        console.log(err);
      }
      
      return cb(undefined, results.rows);
    }
  );
}
static get_offence_categories (cb) {
  client.query(
    `SELECT  category_name from offence_category `,
    
    (err, results) => {
      if (err) {
        console.log(err);
      }
      
      
      return cb(undefined, results.rows);
    }
  );
}
static victim_gender_vs_offence_categories(category_name,i,cb){
  client.query(
    `SELECT  victim_gender,COUNT(offence_id) FROM OFFENCE NATURAL JOIN victim NATURAL JOIN offence_category  WHERE category_name=$1 GROUP BY victim_gender `,
    [category_name],
    (err, results) => {
      if (err) {
        console.log(err);
        return cb(err);
      }
     
      
      return cb(undefined, results.rows,i);
    }
  );
}
static offender_gender_vs_offence_categories(category_name,i,cb){
  client.query(
    `SELECT  offender_gender,COUNT(offence_id) FROM OFFENCE NATURAL JOIN offender NATURAL JOIN offence_category  WHERE category_name=$1 GROUP BY offender_gender `,
    [category_name],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      
      
      return cb(undefined, results.rows,i);
    }
  );
}
static victim_age_wise_offence_count(cb){
  client.query(
    `SELECT victim_age FROM victim `,
   
    (err, results) => {
      if (err) {
        console.log(err);
      }
      
      
      return cb(undefined, results.rows);
    }
  );
}
static offender_age_wise_offence_count(cb){
  client.query(
    `SELECT offender_age FROM offender `,
   
    (err, results) => {
      if (err) {
        console.log(err);
      }
      
      
      return cb(undefined, results.rows);
    }
  );
}
static offender_age_wise_offence_category(start,end,cb){
  client.query(
    `select COUNT(offender_age),category_name from offence NATURAL JOIN offender NATURAL JOIN offence_category where offender_age BETWEEN $1 AND $2 group by category_name`
    ,[start,end],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      
      
      return cb(undefined, results.rows);
    }
  );
}
static victim_age_wise_offence_category(start,end,cb){
  client.query(
    `select COUNT(victim_age),category_name from offence NATURAL JOIN victim NATURAL JOIN offence_category where victim_age BETWEEN $1 AND $2 group by category_name`
    ,[start,end],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      
      
      return cb(undefined, results.rows);
    }
  );
}

}
module.exports = {sql_helper_charts };
