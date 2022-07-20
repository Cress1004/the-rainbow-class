const mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');

const gradeSchema = mongoose.Schema({
    title: String
});

gradeSchema.plugin(mongoose_delete, { deletedAt : true });
const Grade = mongoose.model('Grade', gradeSchema, 'grades');

module.exports = { Grade }
