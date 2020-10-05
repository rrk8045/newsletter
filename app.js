const express=require("express");
const bodyparser=require("body-parser");
const request=require("request");
const https=require("https");
const app=express();

//to render our static files
app.use(express.static("public"));
//body parser for identify the data
app.use(bodyparser.urlencoded({extended:true}));
// get the data
app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
});
//post the data
app.post("/",function(req,res){
  const first=req.body.fnme;
  const last=req.body.lnme;
  const mail=req.body.email;

  var data={
    members:[
      {
      email_address:mail,
      status:"subscribed",
      merge_fields:{
        FNAME:first,
        LNAME:last
      }
    }
  ]
};
  const jsonData=JSON.stringify(data);
  const url="https://us2.api.mailchimp.com/3.0/lists/49b79ff423";
  const options={
    method:"POST",
    headers:{
    Authorization:"auth 9b140d3dc739edf55979f1ea0f77deb2-us2"
  },
  body:jsonData
}


  const request=https.request(url,options,function(reponse){
    if(reponse.statusCode===200){
      res.sendFile(__dirname+"/success.html");
    }
    else{
      res.sendFile(__dirname+"/failure.html");
    }
    reponse.on("data",function(data){
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

//list id
//49b79ff423
//api key
//9b140d3dc739edf55979f1ea0f77deb2-us2

app.post("/failure.html",function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT||3000,function(){
  console.log("server is running on port 3000");
});
