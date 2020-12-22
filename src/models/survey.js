const mongoose = require("mongoose");
var ValidatorError = mongoose.Error.ValidatorError;
const question = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Content of question is required']
    },
    typeQuestion: {
        type: String,
        required: [true, 'Type of question is required'],
        enum: ['choice', 'multiple', 'fill']
    },
    answer: {
        type: mongoose.Schema.Types.Mixed,
        required: [
            function() {
                return (this.typeQuestion === 'choice' || this.typeQuestion === 'multiple')
            }, 'Answer of question is required'
        ]
    }
})

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
    questionnaire: {
        type: [question],
        required: [true, 'Questionnaire of survey is required']
    },
    responses: {
        type: [reply],
        default: []
    },
    expiredTime: {
        type: Date,
        required: [true, 'Expired time of survey is required']
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

survey.pre('save', async function(next) {
    let currentSurvey = this;
    // If you call `next()` with an argument, that argument is assumed to be
    // an error.
    if (currentSurvey.isNew || currentSurvey.isModified('questionnaire')) {
        let questionnaire = currentSurvey.questionnaire;
        questionnaire = await Promise.all(questionnaire.map(async(question) => {
            if (question.typeQuestion === 'choice' || question.typeQuestion === 'multiple') {
                let answer = await question.answer.map(value => {
                    return {
                        _id: new mongoose.Types.ObjectId,
                        content: value
                    }
                })
                return {
                    _id: question._id,
                    question: question.question,
                    typeQuestion: question.typeQuestion,
                    answer: answer
                }
            } else if (question.typeQuestion === 'fill') {
                return {
                    _id: question._id,
                    question: question.question,
                    typeQuestion: question.typeQuestion,
                }
            }
        }));
        currentSurvey.questionnaire = questionnaire;
    }
    next();
});

//Validate input
reply.pre('save', async function(next) {
    let currentRely = this;
    let survey = currentRely.parent();
    let answerSheet = currentRely.answerSheet;
    let questionnaire = survey.questionnaire
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