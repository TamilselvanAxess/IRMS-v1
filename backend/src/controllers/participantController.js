

import Participant from "../models/participantModel.js";


//create participant

const createParticipant = async (req, res,next) => {
    try {
        const {name, role, empId, status,} = req.body;
        // const existingParticipant = await Participant.findOne({name});

        const existingParticipant = await Participant.findOne({empId});
        
        if(existingParticipant){
            return res.status(400).json({message: 'Participant already exists'});
        }
        
        const participant = await Participant.create({name, role, status,empId});
        res.status(201).json({message: 'Participant created successfully', participant});
    } catch (error) {
        next(error);
    }
}

//get all participants

const getAllParticipants = async (req, res,next) => {
    try {
        const {
            limit = 10,
            page = 1,
            search = '',
            sort = 'createdAt:desc',
            status,
        } = req.query;
        const query = {};
        if(search){
            query.$or = [
                {name: {$regex: search, $options: 'i'}},
            ];
        }
        if(status){
            query.status = status;
        }
        const participants = await Participant.find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);
        const totalParticipants = await Participant.countDocuments(query);
        res.status(200).json({message: 'Participants fetched successfully', participants, totalParticipants});
    } catch (error) {
        next(error);
    }
}

const getParticipantByRole = async (req, res,next) => {
    try {
        const {role} = req.params;
        if(!role){
            return res.status(400).json({message: 'Role is required'});
        }
        const participants = await Participant.find({role,status:'active'});
        res.status(200).json({message: 'Participants fetched successfully', participants});
    } catch (error) {
        next(error);
    }
}


//get participant by id

const getParticipantById = async (req, res,next) => {
    try {
        const {participantId} = req.params;
        const participant = await Participant.findById(participantId);
        if(!participant){
            return res.status(404).json({message: 'Participant not found'});
        }
        res.status(200).json({message: 'Participant fetched successfully', participant});
    } catch (error) {
        next(error);
    }
}

//update participant

const updateParticipant = async (req, res,next) => {
    try {
        const {participantId} = req.params;
        const {name, role, status, empId} = req.body;
        const existingParticipant = await Participant.findById(participantId);
        if(!existingParticipant){
            return res.status(404).json({message: 'Participant not found'});
        }
        const participant = await Participant.findByIdAndUpdate(participantId, {name, role, status, empId}, {new: true});
        res.status(200).json({message: 'Participant updated successfully', participant});
    } catch (error) {
        next(error);
    }
}

//delete participant

const deleteParticipant = async (req, res,next) => {
    try {
        const {participantId} = req.params;
        await Participant.findByIdAndDelete(participantId);
        res.status(200).json({message: 'Participant deleted successfully'});
    } catch (error) {
        next(error);
    }
}

//change participant status

const changeParticipantStatus = async (req, res,next) => {
    try {
        const {participantId} = req.params;
        const {status} = req.body;
        const participant = await Participant.findByIdAndUpdate(participantId, {status}, {new: true});
        if(!participant){
            return res.status(404).json({message: 'Participant not found'});
        }
        res.status(200).json({message: 'Participant status changed successfully', participant});
    } catch (error) {
        next(error);
    }
}



 export {createParticipant, getAllParticipants,getParticipantByRole, getParticipantById, updateParticipant, deleteParticipant, changeParticipantStatus};
