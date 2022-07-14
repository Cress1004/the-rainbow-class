const mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');

const studentTypeSchema = mongoose.Schema({
    title: String
});

studentTypeSchema.plugin(mongoose_delete, { deletedAt : true });
const StudentType = mongoose.model('StudentType', studentTypeSchema, 'studentTypes');

module.exports = { StudentType }
