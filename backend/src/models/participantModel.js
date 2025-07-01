import mongoose from "mongoose";


const participantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['trainer', 'proxy','referrer','agent'],
        default: 'agent',
    },
    // for unique validation 
    empId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

},{
    timestamps:true
});

const Participant = mongoose.model('Participant', participantSchema);

export default Participant;


