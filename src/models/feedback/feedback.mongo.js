const { Schema, model } = require('mongoose');

const feedbackSchema = new Schema(
  {
    recommendation: {
      type: String,
    },
    incidentInspection: {
      type: String,
    },
    correctiveAction: {
      type: String,
    },
    photo: { type: String },
    photoWorkArea: {
      type: String,
    },
    closedBy: {
      type: String,
    },
    closedDate: {
      type: Date,
    },
    report: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

const Feedback = model('Feedback', feedbackSchema);
module.exports = Feedback;
