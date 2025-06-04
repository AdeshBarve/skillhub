const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name : {
      type: String,
      required: [true, 'name is required']
    },
    email: {
      type: String,
      required: [true, 'email is required']
    },
    phone: {
      type: Number
    },
    query: {
      type: String,
      required: [true, 'Query is required']
    }}
);

module.exports = mongoose.model('Contact', contactSchema);
