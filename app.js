const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us10.api.mailchimp.com/3.0/lists/f222cc009d";

  const options = {
    method: "POST",
    auth: "Aleksey1:31bc22542e103e115d249347123c5125-us10",
  };

  const request = https.request(url, options, (response) => {
    response.statusCode === 200
      ? res.sendFile(__dirname + "/success.html")
      : res.sendFile(__dirname + "/failure.html");

    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
