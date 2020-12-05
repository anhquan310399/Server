const mongoose = require("mongoose");

const studentAnswer = new mongoose.Schema({
    questionId: {
        type: String,
        required: true
    },
    answerId: {
        type: String,
        default: ''
    },
})

const studentAnswerSheet = new mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },
    answers: {
        type: [studentAnswer],
        required: true
    },
    grade: Number,
    isSubmitted: {
        type: Boolean,
        default: false
    },
    startTime: {
        type: Date,
        default: Date.now()
    }
});

studentAnswerSheet.pre('save', async function(next) {
    let answerSheet = this;
    if (answerSheet.isModified('answers')) {
        let exam = answerSheet.parent();
        let quizBank = answerSheet.parent().parent().parent().quizBank
            .find(value => {
                return value._id = exam.setting.code;
            });
        let amount = await answerSheet.answers.reduce(async function(res, current) {
                let question = await quizBank.questions.find(function(value) {
                    return (value._id == current.questionId);
                });
                let grade = 0;

                question.answers.forEach(element => {
                    if (element._id == current.answerId && element.isCorrect) {
                        grade++;
                    }
                });
                if (question.typeQuestion === 'multiple') {
                    grade /= question.answers.length;
                }

                return (await res) + grade;
            },
            0);

        answerSheet.grade = amount;
    }
    next();
})

module.exports = studentAnswerSheet