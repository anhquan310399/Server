const mongoose = require("mongoose");
var ValidatorError = mongoose.Error.ValidatorError;

const answerSheet = new mongoose.Schema({
    idQuestion: {
        type: String,
        required: true,
    },
    answer: {
        type: mongoose.Schema.Types.Mixed,
        required: [true, 'Please fill answer']
    }
})

const reply = new mongoose.Schema({
    idStudent: {
        type: String,
        required: true
    },
    answerSheet: {
        type: [answerSheet],
        required: [true, 'Please fill all answer']
    },
    timeResponse: {
        type: Date,
        default: Date.now()
    }
})

const survey = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name of survey is required!']
    },
    description: String,
    code: {
        type: String,
        required: [true, 'Code of questionnaire is required']
    },
    responses: {
        type: [reply],
        default: []
    },
    expireTime: {
        type: Date,
        required: [true, 'Expire time of survey is required']
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

//Validate input
reply.pre('save', async function(next) {
    let currentRely = this;
    let survey = currentRely.parent();
    let answerSheet = currentRely.answerSheet;
    let questionnaire = survey.parent().parent().surveyBank.find(value => {
        return value._id = survey.code;
    }).questions;
    console.log(questionnaire);
    if (answerSheet.length !== questionnaire.length) {
        let err = new ValidatorError({
            message: 'PLease fill all answer of questionnaire'
        });
        return next(err);
    }
    answerSheet.forEach(answerSheet => {
        let question = questionnaire.find(value => value._id == answerSheet.idQuestion);
        if (!question) {
            let err = new ValidatorError({
                message: `Can not found question ${answerSheet.idQuestion} in questionnaire`
            });
            return next(err);
        }
        if (question.typeQuestion === 'choice') {
            let answer = question.answer.find(value => value._id == answerSheet.answer);
            if (!answer) {
                let err = new ValidatorError({
                    message: `Can not found answer ${answerSheet.answer} in question ${question.question}`
                });
                return next(err);
            }
        } else if (question.typeQuestion === 'multiple') {
            answerSheet.answer.forEach(currentAnswer => {
                let answer = question.answer.find(value => value._id == currentAnswer);
                if (!answer) {
                    let err = new ValidatorError({
                        message: `Can not found answer ${currentAnswer} in question ${question.question}`
                    });
                    return next(err);
                }
            });
        }

    });

    next();
});



module.exports = survey;