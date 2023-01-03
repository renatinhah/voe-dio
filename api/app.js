var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require("mongoose");

var cors = require('cors');
require('dotenv').config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

mongoose.set("strictQuery", false);
mongoose.connect('mongodb://localhost:27017/VoeDio', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
});
var db = mongoose.connection;

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/availability', require("./routes/availabilityRoute"));
app.use('/reserve', require("./routes/reservationRoute"));

db.on("error", console.error.bind(console, "connection error"));
db.once("open", _ => {
    console.log("Conectado com o banco");
});

const sendMail = async(msg) => {
    try{
        await sgMail.send(msg);
        console.log("Mensagem enviada com sucesso!");
    }catch(error){
        console.error(error);
        if(error.response){
            console.error(error.response.body);
        }
    }
}

sendMail({
    to: "",
    from: "",
    subject: "Confirmação de cadastro no sistema",
    text: "Parabéns, você acaba de se registrar no sistema Voe Dio",
  });

module.exports = app;
