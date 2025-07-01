import mongoose from "mongoose";


const agentSchema = new mongoose.Schema({
    agentId: {
        type: String,
        required: true,
    },
    agentName: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
 
});

const Agent = mongoose.model('Agent', agentSchema);

export default Agent;


