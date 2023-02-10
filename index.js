const express = require("express");
//const {Router}express = require("express");
// const bodyParser = require('body-parser');
const dbConnect = require("./config/dbConnect");
const app = express(); //9.41min/sec
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4004;


//Route paths

const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");
const categoryRouter = require("./routes/productcategoryRoute");
const blogcategoryRouter = require("./routes/blogCategoryRoute");
const brandRouter = require("./routes/brandRoute");
const couponRouter = require("./routes/couponRoute");


const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const morgan = require("morgan"); //here i install morgan timestamps : 2:46hr/min https://www.youtube.com/watch?v=S6Yd5cPtXr4&list=PL0g02APOH8olUaSJUReizC6KQXTrGYNU6&index=28

dbConnect();



// app.use("/", (req, res) => {
//     res.send("Hello from server site. ");
// });
//after install morgan here i use morgan.

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", categoryRouter);
app.use("/api/blogcategory", blogcategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRouter);


//middleware

app.use(notFound);
//app.request(errorHandler); i did error here because i wrote it wrong.
app.use(errorHandler); // when i hit it again it show me req.status not a function.

app.listen(PORT, () => {
    console.log(`server is runnig at ${PORT}`);
});
