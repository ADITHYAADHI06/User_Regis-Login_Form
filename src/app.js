require("dotenv").config();
const { hasSubscribers } = require("diagnostics_channel");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const port = process.env.PORT || 4000;
require("./db/connection");

const path = require("path");
const staticpath = path.join(__dirname, "../public");
const views_path = path.join(__dirname, "../template/views");
const partials_path = path.join(__dirname, "../template/partials");

// console.log(partials_path);
// console.log(__dirname);
// console.log(staticpath);
app.use(express.static(staticpath));
app.set("view engine", "hbs");
app.set("views", views_path);

const hbs = require("hbs");
hbs.registerPartials(partials_path);

const Registration = require("./models/register");

app.get("/", (req, res) => {
  res.render("index");
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/registretion", async (req, res) => {
  try {
    const password = req.body.password;
    const Cpassword = req.body.confirmpassword;

    if (password === Cpassword) {
      const registersData = new Registration({
        firstname: req.body.FirstName,
        lastname: req.body.LastName,
        age: req.body.age,
        email: req.body.email,
        gender: req.body.gender,
        phonenumber: req.body.phonenumber,
        password: password,
        confirmpassword: Cpassword,
      });

      // token
      const token = await registersData.generateAuthToken();
      // console.log(token);

      const registeredData = await registersData.save();
      // console.log(registeredData);

      res.render("index");
    } else {
      res.send("password not macthing");
    }
  } catch (e) {
    res.status(404).send("erooor");
  }
});

app.get("/registretion", (req, res) => {
  res.render("registration");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await Registration.findOne({ email: email });
    // console.log(user);

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // token
      const token = await user.generateAuthToken();
      // console.log(token);

      res.status(201).render("index");
    } else {
      res.status(404).send("invalid login");
    }
  } catch (e) {
    res.send("invalid login ");
  }
});

app.listen(port, () => {
  console.log("conection established ");
});
