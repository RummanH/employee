const { Schema, model } = require('mongoose');

const reportSchema = new Schema(
  {
    department: {
      type: String,
      required: [true, 'Please select a department!'],
    },
    workArea: {
      type: String,
      required: [true, 'Please select a working area!'],
    },
    dateTime: {
      type: Date,
      required: [true, 'Please provide date and time!'],
    },
    typeNearMiss: [String],
    typeNearMissDescribe: {
      type: String,
    },
    typeConcern: [String],
    typeConcernDescribe: {
      type: String,
    },
    potentialIncident: {
      type: String,
      required: [true, 'Please provide a potential incident!'],
    },
    isHseViolated: {
      type: Boolean,
    },
    photo: { type: String },
    observerName: {
      type: String,
      required: [true, 'Please provide observer name!'],
    },
    reportDate: {
      type: Date,
      required: [true, 'Please provide report date!'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
    },
    isReviewed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

const Report = model('Report', reportSchema);
module.exports = Report;
