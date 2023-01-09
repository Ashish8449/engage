const { sql_helper_charts } = require("../sql-helpers/sql-helper-charts");

class charts {
  static region_wise_offence_count(cb) {
    
    sql_helper_charts.region_wise_offence_count(function (err, results) {
        if (err == undefined) {
        
         var x=[];
         var y=[];
         for (var i=0;i<results.length;i++){
           x.push(results[i].region)
           y.push(parseInt(results[i].count))
         }
        

         return cb(undefined,x,y);
}

});
        }

        static victim_gender_wise_offence_count(cb) {
    
          sql_helper_charts.victim_gender_wise_offence_count(function (err, results) {
              if (err == undefined) {
              
               var x=[];
               var y=[];
               
               for (var i=0;i<results.length;i++){
                 x.push(results[i].victim_gender)
                 y.push(parseInt(results[i].count))
               }
              
      
               return cb(undefined,x,y);
      }
      
      });
              }


              static offender_gender_wise_offence_count(cb) {
    
                sql_helper_charts.offender_gender_wise_offence_count(function (err, results) {
                    if (err == undefined) {
                    
                     var x=[];
                     var y=[];
                     //console.log('123',results);
                     for (var i=0;i<results.length;i++){
                       x.push(results[i].offender_gender)
                       y.push(parseInt(results[i].count))
                     }
                    
            
                     return cb(undefined,x,y);
            }
            
            });
                    }
      
      
static victim_gender_vs_offence_categories(cb) {

sql_helper_charts.get_offence_categories(function (err, results) {
 
if (err == undefined) {

var x=[];
var yfemale=[];
var ymale=[];
var yother=[];
for (var i=0;i<results.length;i++){
x.push(results[i].category_name);
yfemale.push(0);
ymale.push(0);
yother.push(0);

sql_helper_charts.victim_gender_vs_offence_categories(results[i].category_name,i,function (err, results2,i) {
if (err == undefined) {

for (var j=0;j<results2.length;j++){

if(results2[j].victim_gender=='Female'){
  yfemale[i]=results2[j].count;
 
}
else if(results2[j].victim_gender=='Male'){
  ymale[i]=results2[j].count;
}
else if(results2[j].victim_gender=='Other'){
  yother[i]=results2[j].count;
}

}
if (i==results.length-1||results.length==0){
  return cb(undefined,x,yfemale,ymale,yother);
}




}
//console.log(x,yfemale,ymale,yother);
});
}
if (i==results.length-1||results.length==0){
  return cb(undefined,x,yfemale,ymale,yother);
}
}

});
}


static offender_gender_vs_offence_categories(cb) {

  sql_helper_charts.get_offence_categories(function (err, results) {
  if (err == undefined) {
  
  var x=[];
  var yfemale=[];
  var ymale=[];
  var yother=[];
  for (var i=0;i<results.length;i++){
  x.push(results[i].category_name);
  yfemale.push(0);
  ymale.push(0);
  yother.push(0);
  
  sql_helper_charts.offender_gender_vs_offence_categories(results[i].category_name,i,function (err, results2,i) {
  if (err == undefined) {
  
  for (var j=0;j<results2.length;j++){
  
  if(results2[j].offender_gender=='Female'){
    yfemale[i]=results2[j].count;
   
  }
  else if(results2[j].offender_gender=='Male'){
    ymale[i]=results2[j].count;
  }
  else if(results2[j].offender_gender=='Other'){
    yother[i]=results2[j].count;
  }
  
  }
  if (i==results.length-1||results.length==0){
    return cb(undefined,x,yfemale,ymale,yother);
  }
  
  
  
  
  }
  //console.log(x,yfemale,ymale,yother);
  });
  }
  if (i==results.length-1||results.length==0){
    return cb(undefined,x,yfemale,ymale,yother);
  }
  
  
  }
  });
  }
static get_slab(age){
  if(age<19){
    return 1
  }
  else if(age>18 && age<60){
    return 2
  }
  else if(age>59){
    return 3
  }
}
static victim_age_wise_offence_count(cb){
  sql_helper_charts.victim_age_wise_offence_count(function (err, results) {
    if (err == undefined) {
    
     var x=['0-18','19-59','60 above'];
     var y1=0;
     var y2=0;
     var y3=0;
    
     for (var i=0;i<results.length;i++){
      var slab=charts.get_slab(results[i].victim_age);
      if(slab==1){
        y1+=1;
       
      }
      else if(slab==2){
        y2+=1;
        
      }
      else if(slab==3){
        y3+=1;
       
      }
     }
     var y=[y1,y2,y3];
    
     

     return cb(undefined,x,y);
}

});
}
static offender_age_wise_offence_count(cb){
  sql_helper_charts.offender_age_wise_offence_count(function (err, results) {
    if (err == undefined) {
    
     var x=['0-18','19-59','60 above'];
     var y1=0;
     var y2=0;
     var y3=0;
    
     for (var i=0;i<results.length;i++){
      var slab=charts.get_slab(results[i].offender_age);
      if(slab==1){
        y1+=1;
       
      }
      else if(slab==2){
        y2+=1;
        
      }
      else if(slab==3){
        y3+=1;
       
      }
     }
     var y=[y1,y2,y3];
    
     

     return cb(undefined,x,y);
}

});
}
        

static offender_age_wise_offence_category(cb){

var start=0;
var end=18;

  sql_helper_charts.offender_age_wise_offence_category(start,end,function (err, results1) {
    if (err == undefined) {
      start=19;
      end=59;
      sql_helper_charts.offender_age_wise_offence_category(start,end,function (err, results2) {
        if (err == undefined) {
          start=60;
          end=10000;
          sql_helper_charts.offender_age_wise_offence_category(start,end,function (err, results3) {
            if (err == undefined) {
             
              sql_helper_charts.get_offence_categories(function (err, results) {
                if (err == undefined) {
                console.log('results',results,results1,results2,results3);
                  var x=[];
                  var y1=[];
                  var y2=[];
                  var y3=[];
                for (var i=0;i<results.length;i++){
                x.push(results[i].category_name);
                y1.push(0);
                y2.push(0);
                y3.push(0);
                }
                var i=0;
               while(i<results.length){
                  for(var j=0;j<results1.length;j++){
                    if(x[i]==results1[j].category_name){
y1[i]=results1[j].count;

                    }
                  }
                  for(var j=0;j<results2.length;j++){
                    if(x[i]==results2[j].category_name){
y2[i]=results2[j].count;
console.log('y2=',y2);
                    }
                  }
                  for(var j=0;j<results3.length;j++){
                    if(x[i]==results3[j].category_name){
y3[i]=results3[j].count;
                    }
                  }
                  i++;
                 
                  }
console.log(x,y1,y2,y3);
return cb(undefined,x,y1,y2,y3);
              }
            });
        }

        
        });
    }
    
    });
    
}

});

}
        
static victim_age_wise_offence_category(cb){

  var start=0;
  var end=18;
  
    sql_helper_charts.victim_age_wise_offence_category(start,end,function (err, results1) {
      if (err == undefined) {
        start=19;
        end=59;
        sql_helper_charts.victim_age_wise_offence_category(start,end,function (err, results2) {
          if (err == undefined) {
            start=60;
            end=10000;
            sql_helper_charts.victim_age_wise_offence_category(start,end,function (err, results3) {
              if (err == undefined) {
               
                sql_helper_charts.get_offence_categories(function (err, results) {
                  if (err == undefined) {
                  console.log('results',results,results1,results2,results3);
                    var x=[];
                    var y1=[];
                    var y2=[];
                    var y3=[];
                  for (var i=0;i<results.length;i++){
                  x.push(results[i].category_name);
                  y1.push(0);
                  y2.push(0);
                  y3.push(0);
                  }
                  var i=0;
                 while(i<results.length){
                    for(var j=0;j<results1.length;j++){
                      if(x[i]==results1[j].category_name){
  y1[i]=results1[j].count;
  
                      }
                    }
                    for(var j=0;j<results2.length;j++){
                      if(x[i]==results2[j].category_name){
  y2[i]=results2[j].count;
  console.log('y2=',y2);
                      }
                    }
                    for(var j=0;j<results3.length;j++){
                      if(x[i]==results3[j].category_name){
  y3[i]=results3[j].count;
                      }
                    }
                    i++;
                   
                    }
  console.log(x,y1,y2,y3);
  return cb(undefined,x,y1,y2,y3);
                }
              });
          }
  
          
          });
      }
      
      });
      
  }
  
  });
  
  }
          
                           
                  }
                  
                





  

module.exports = {charts };
