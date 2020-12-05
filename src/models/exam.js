const mongoose = require("mongoose");

const studentAnswerSheetSchema = require("./studentAnswerSheet")

const setting = new mongoose.Schema({
    questionCount: {
        type: Number,
        require: [true, "Vui lòng nhập số lượng câu hỏi"]
    },
    timeToDo: {
        type: Number,
        require: [true, "Vui lòng nhập thời lượng làm bài"]
    },
    code: {
        type: String,
        require: [true, "Vui lòng chọn tập câu hỏi"]
    },
    attemptCount: {
        type: Number,
        required: true,
        default: 1
    }
}, { _id: false });

const exam = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Vui lòng nhập tên bài kiểm tra"]
    },
    content: {
        type: String,
        required: [true, "Vui lòng nhập yêu cầu bài kiểm tra"]
    },
    startTime: {
        type: Date,
        required: [true, "Vui lòng chọn thời gian bắt đầu bài kiểm tra"]
    },
    expireTime: {
        type: Date,
        required: [true, "Vui lòng chọn thời gian kết thúc bài kiểm tra"]
    },
    submissions: [studentAnswerSheetSchema],
    setting: {
        type: setting,
        required: [true, "Vui lòng thiết lập cài đặt bài kiểm tra"]
    }
}, { timestamps: true });


module.exports = exam