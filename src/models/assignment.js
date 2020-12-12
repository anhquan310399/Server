const mongoose = require("mongoose");
const file = require('./file');

//Thêm trường comment để khiếu nại điểm
const feedBack = new mongoose.Schema({
    grade: {
        type: Number,
        required: [true, "Vui lòng nhập số điểm!"],
        min: [0, "Điểm thấp nhất là 0!"],
        max: [10, "Điểm cao nhất là 10!"]
    },
    gradeOn: {
        type: Date,
        required: true
    },
    gradeBy: {
        type: String,
        required: true
    }
}, { _id: false });

const submission = new mongoose.Schema({
    idStudent: {
        type: String,
        required: true
    },
    file: {
        type: file,
        required: [true, "Vui lòng thêm file"],
    },
    submitTime: {
        type: Date,
        default: Date.now()
    },
    feedBack: feedBack
});

const setting = new mongoose.Schema({
    startTime: {
        type: Date,
        required: [true, "Chưa nhập thời gian bắt đầu!"]
    },
    expireTime: {
        type: Date,
        required: [true, "Chưa nhập thời gian kết thúc!"],
        validate: [function(value) {
            return value > this.startTime
        }, "Ngày hết hạn phải lớn hơn ngày bắt đầu"]
    },
    isOverDue: {
        type: Boolean,
        default: false
    },
    overDueDate: {
        type: Date,
        required: [function() {
            return this.isOverDue;
        }, "Chưa nhập thời gian quá hạn"],
        validate: [function(value) {
            return value > this.expireTime
        }, "Thời gian quá hạn phải hơn thời gian kết thúc"]
    },
    // fileCount: {
    //     type: Number,
    //     min: [1, "Số lượng file nộp tối thiểu là 1"],
    //     max: [5, "Số lượng file nộp tối đa là 5"],
    //     default: 1
    // },
    fileSize: {
        type: Number,
        min: [5, "Kích thước file nộp tối thiểu là 5mb"],
        max: [500, "Kích thước file nộp tối đa là 500mb"],
        default: 5
    }

}, { _id: false });

const assignment = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Chưa nhập tên bài tập"]
    },
    content: {
        type: String,
        required: [true, "Chưa nhập mô tả cho bài tập"]
    },
    setting: {
        type: setting,
        required: true
    },
    submissions: [submission],
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = assignment