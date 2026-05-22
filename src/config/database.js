const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://mauryasatish146_db_user:mivTR6uM0LABqPdl@cluster0.b2rcfwb.mongodb.net/justMatchDB")
}

module.exports = connectDB;