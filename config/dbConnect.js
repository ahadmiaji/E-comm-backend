const { default: mongoose } = require("mongoose")
//https://www.youtube.com/watch?v=S6Yd5cPtXr4&list=PL0g02APOH8olUaSJUReizC6KQXTrGYNU6&index=23 timestamps 10.30min/sec here i understand how to connect with local mongodb
const dbConnect = () => {
    mongoose.set('strictQuery', true);
    try {
        const conn = mongoose.connect(process.env.MONGODB_URL);
        console.log(`Database connected`);
    } catch (error) {
        console.log("databasse error");
    }
};

module.exports = dbConnect;
