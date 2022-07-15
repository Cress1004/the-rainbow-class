const mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');

const homeworkSchema = mongoose.Schema({
    content: {
        type: String,
        maxLength: 5000,
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
    },
    deadline: Date
});

homeworkSchema.plugin(mongoose_delete, { deletedAt : true });
const Homework = mongoose.model('Homework', homeworkSchema);

module.exports = { Homework }