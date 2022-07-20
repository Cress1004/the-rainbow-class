const mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');

const subjectSchema = mongoose.Schema({
    title: String
});

subjectSchema.plugin(mongoose_delete, { deletedAt : true });
const Subject = mongoose.model('Subject', subjectSchema, 'subjects');

module.exports = { Subject }
