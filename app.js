const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const port = process.env.PORT || 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res)=>{
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const email = req.body.email;
    const apiKey = "1e5e37a7e47d6125d3763c4df51059df-us14";
    const listId = "33fa1a6baa";

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                } 
            }
        ]
    }
    const jsonData = JSON.stringify(data);
    const url =  "https://us14.api.mailchimp.com/3.0/lists/" + listId;
    const options = {
        method: "POST",
        auth: "saarim04:" + apiKey,
    }
    const request = https.request(url, options, (response)=>{

        if(response.statusCode==200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }
        response.on("data", (data)=>{
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
});

app.post("/failure", (req, res)=>{
    res.redirect("/");
});

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})