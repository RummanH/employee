const { Schema, model } = require('mongoose');

const reportSchema = new Schema(
  {
    department: {
      type: String
    },
    workArea: {
      type: String,
    },
    dateTime: {
      type: Date
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
      type: String
    },
    isHseViolated: {
      type: Boolean,
    },
    photo: { type: String },
    observerName: {
      type: String
    },
    reportDate: {
      type: Date
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
