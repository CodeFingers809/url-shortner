require("dotenv").config({ path: "./.env" });
const express = require("express");
const dbConnect = require("./db/dbConnect");
const url = require("./models/urlSchema");
const request = require("request");
const axios = require("axios")
const { stringify } = require("querystring");

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function addSeconds(numOfSeconds, date = new Date()) {
  date.setSeconds(date.getSeconds() + numOfSeconds);
  return date;
}

app.get("/", async (req, res) => {
  res.render("index");
});

app.post("/make", async (req, res) => {
  try {
    const { destURL, author, days } = req.body;
    const data = await url.create({
      url: destURL,
      author: author,
      expireAt:
        days === "never" ? null : addSeconds(Number(days) * 24 * 60 * 60),
    });
    res.render("index", { fileLink: `${req.headers.origin}/${data.id}` });
  } catch (error) {
    console.error(error);
    res.send({ error: error });
  }
});

app.get("/:id",async (req, res) => {
  try {
    const required = await url.findById(req.params.id)
    res.render("shorten",{found:required});
  } catch (error) {
    console.error(error);
    res.send({ error: error });
  }
})

app.post("/captcha", async (req, res) => {
  if (!req.body.captcha) {
    return res.json({ success: false, msg: "Please select captcha" });
  }
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const query = stringify({
    secret: secretKey,
    response: req.body.captcha,
    remoteip: req.socket.remoteAddress,
  });
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?${query}`;

  // Make a request to verifyURL
  // const body = await axios(verifyUrl).then((res) => res.json());
  const body = await axios.post(verifyUrl)

  // If not successful
  if (body.success !== undefined && !body.success)
    {
      return res.json({ success: false, msg: "Failed captcha verification" });}

  // If successful
  return res.json({ success: true, msg: "Captcha passed" });
});

app.listen(process.env.PORT, () => {
  console.log("running");
});
