const mongoose = require("mongoose");
const timelineSchema = require("./timeline");
const questionModel = require('./question');
const UserDb = require('./user');
var ValidatorError = mongoose.Error.ValidatorError;

const chapter = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name of chapter is required']
    },
    questions: [questionModel]
});

const ratio = new mongoose.Schema({
    idField: {
        type: String,
        required: true
    },
    ratio: {
        type: Number,
        default: 1
    }
})

const Schema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name of subject is required']
    },
    idLecture: {
        type: String,
        required: [true, 'Id lecture is required'],
        validate: async function(value) {
            await UserDb.findOne({ code: value, idPrivilege: 'teacher' })
                .then(teacher => {
                    if (!teacher) {
                        throw new ValidatorError({
                            message: 'Not found teacher',
                            type: 'validate',
                            path: 'idLecture'
                        })
                    }
                });
        }

    },
    quizBank: [chapter],
    timelines: [timelineSchema],
    studentIds: {
        type: [String],
        validate: async function(list) {
            await Promise.all(list.map(async(idStudent) => {
                console.log(idStudent);
                let student = await UserDb.findOne({ code: idStudent }).
                then(data => data);
                if (!student) {
                    throw new ValidatorError({
                        message: `Not found student with code: ${idStudent}`,
                        type: 'validate',
                        path: 'studentIds'
                    })
                }
                return idStudent;
            }));
        }
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    transcript: {
        type: [ratio],
        default: []
    }
}, {
    timestamps: true
});

Schema.pre('save', function(next) {
    var subject = this;
    if (subject.isModified('studentIds')) {
        subject.studentIds = subject.studentIds.sort();
    }
    next();
});

module.exports = mongoose.model("subject", Schema);