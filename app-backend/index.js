const express = require("express");
const {
  addNewStudent,
  isStudentExist,
  isStudentPresentToday,
  markStudentPresentToday,
} = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/register_new_student", async (req, res) => {
  const name = req.query.name;
  const usnID = req.query.usnID;
  const password = req.query.password;

  const isStudentAlreadyExist = await isStudentExist(usnID);
  if (isStudentAlreadyExist) {
    res.send({
      status: "already_exists",
      message: "Student already exist!",
    });

    return false;
  }

  await addNewStudent({
    name: name,
    usnID: usnID,
    password: password,
  });

  res.send({
    status: "created",
    message: "Account has been created!",
  });
});

app.get("/mark_present", async (req, res) => {
  const usnID = req.query.usnID;
  const isAlreadyPresent = await isStudentPresentToday(usnID);
  if (isAlreadyPresent) {
    res.send({
      status: "already_present",
      message: "Student is already marked present today.",
    });
    return false;
  }
  await markStudentPresentToday(usnID);
  res.send({
    status: "marked_present",
    message: "Student has been marked present today!",
  });
});

app.listen(PORT, () => {
  console.log(`[+] Server is running on the port ${PORT}`);
});
