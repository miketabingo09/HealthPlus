const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bodyParse = require("body-parser");
const app = express();
const nodemailer = require("nodemailer");
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(bodyParse.urlencoded({extended: true}));

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "patient_db"
});


app.post("/data", (request, response) => {
 
  const name = request.body.name;
  const phoneNum = request.body.phoneNum;
  const emailAddress = request.body.emailAddress;
  const date = request.body.date;
  const selectedTypeConsultation = request.body.selectedTypeConsultation;
  const selectedServices = request.body.selectedServices;
  const message = request.body.message;

  const mysqlData = "INSERT INTO patient_data(name, phoneNum, emailAddress, date, selectedTypeConsultation, selectedServices, message) VALUES (?,?,?,?,?,?,?)"

  db.query(mysqlData, [name, phoneNum, emailAddress, date, selectedTypeConsultation, selectedServices, message], (err, res) => {
    if(err) {
      console.log(err);
    } else {
      console.log(res);
    }
  })
  
})

//send the data to appointment_history
app.post("/historyAppointment", (request, response) => {

  const name = request.body.name;
  const phoneNum = request.body.phoneNum;
  const emailAddress = request.body.emailAddress;
  const date = request.body.date;
  const selectedTypeConsultation = request.body.selectedTypeConsultation;
  const selectedServices = request.body.selectedServices;
  const message = request.body.message;

  const mysqlDataHistory = "INSERT INTO history_appointment(name,phoneNum, emailAddress, selectedTypeConsultation, selectedServices, date, message) VALUES (?,?,?,?,?,?,?)"

  db.query(mysqlDataHistory, [name, phoneNum, emailAddress, date, selectedTypeConsultation, selectedServices, message], (err, res) => {
    if(err) {
      console.log("error")
    } else {
      console.log(res)
    }
  })

})


//get the data to the appointment_history
app.get("/dataHistory", (request, response) => {

  const mysqlDataHistory = "SELECT * FROM history_appointment";

  db.query(mysqlDataHistory, (err, res) => {
   response.send(res)
  })

})



app.get("/post", (request, response) => {

  const mysqlPost = "SELECT * FROM patient_data";

  db.query(mysqlPost, (err, res) => {
   response.send(res)
  })

})


app.get("/patient", (request, response) => {

  const mysqlPost = "SELECT * FROM patient_accepted";

  db.query(mysqlPost, (err, res) => {
   response.send(res)
  })

})

app.post("/accepted", (request, response) => {

  const name = request.body.name;
  const phoneNum = request.body.phoneNum;
  const emailAddress = request.body.emailAddress;
  const date = request.body.date;
  const selectedTypeConsultation = request.body.selectedTypeConsultation;
  const selectedServices = request.body.selectedServices;
  const message = request.body.message;

  const mysqlAccepted = "INSERT INTO patient_accepted(name, phoneNum, emailAddress, selectedTypeConsultation, selectedServices, date, message) VALUES (?,?,?,?,?,?,?)"

  db.query(mysqlAccepted, [name, phoneNum, emailAddress, selectedTypeConsultation, selectedServices, date, message], (err, res) => {
    if(err) {
      console.log(err);
    } else {
      console.log(res);
    }
  })
})


app.delete("/deleteData/:id", (request, response) => {

  const id = request.params.id
   const mysqlDelete = "DELETE FROM patient_data WHERE referenceID = ?";
 
   db.query(mysqlDelete, [id], (err, res) => {
     if(err) {
       console.log(err)
     } else {
       console.log("patient data deleted");
     }
   }) 
 
 
 })

 //get the patient appointment schedule
 app.get("/patient/schedule", (request, response) => {

  const mysqlPost = "SELECT * FROM patient_accepted";

  db.query(mysqlPost, (err, res) => {
   response.send(res)
  })

})


//get the patient appointment number in dashboard
app.get("/patient/appointments", (request, response) => {

  const mysqlPost = "SELECT * FROM patient_accepted";

  db.query(mysqlPost, (err, res) => {
   response.send(res)
  })

})

 //send user to the email address approval 

 app.post('/send-email', (req, res) => {

  const email = req.body.emailAddress;
  const name = req.body.name;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "healthplusplus7@gmail.com",
      pass: "smkgnjgfghbgbgpi"
    }
  });

  const mailOptions = {
    from: "healthplusplus7@gmail.com",
    to: `${email}`,
    subject: "Approval Pending for Medical Treatment",
    text: `Dear ${name}, This is Health++, We wanted to inform you that we are currently awaiting approval for the booking appointment, and we will notify you as soon as we receive confirmation.`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('Email sent successfully');
    }
  });
});


//send user to the email address if accepted appointment

app.post('/accepted-email', (req, res) => {

  const email = req.body.emailAddress;
  const date = req.body.date;
  const name = req.body.name;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "healthplusplus7@gmail.com",
      pass: "smkgnjgfghbgbgpi"
    }
  });

  const mailOptions = {
    from: "healthplusplus7@gmail.com",
    to: `${email}`,
    subject: "Confirmation: Your Upcoming Appointment",
    text: `

    Dear ${name},
    
    Thank you for booking an appointment with Health++. We are pleased to confirm the details of your upcoming appointment. Please review the information below:
    
    Appointment Details:
    
    Date: ${date}
    If you have any questions or need to make any changes, please don't hesitate to contact us at 04914314388 / +639191435254. We kindly request that you arrive a few minutes before your scheduled appointment time.
    
    We look forward to meeting you and providing the best possible service. Should you need any further assistance, feel free to reach out to us. We value your time and appreciate your trust in our services.`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('Email sent successfully');
    }
  });
});



// when admin decline appointment
app.delete("/declineData/:id", (request, response) => {

  const id = request.params.id

   const mysqlDelete = "DELETE FROM patient_data WHERE referenceID = ?";
 
   db.query(mysqlDelete, [id], (err, res) => {
     if(err) {
       console.log(err)
     } else {
       console.log("patient data deleted");
     }
   }) 
 })


 //send user to the email address if decline appointment

  app.post('/decline-email', (req, res) => {

  const email = req.body.emailAddress;
  const name = req.body.name;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "healthplusplus7@gmail.com",
      pass: "smkgnjgfghbgbgpi"
    }
  });

  const mailOptions = {
    from: "healthplusplus7@gmail.com",
    to: `${email}`,
    subject: "Appointment Approval Has Been Declined",
    text: `Dear ${name}, I regret to inform you that your request for the medical appointment approval has been declined.`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('Email sent successfully');
    }
  });
});


app.listen(PORT, () => {
  console.log(`${PORT} is running`);
})
