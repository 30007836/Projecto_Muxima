const mongoose = require('mongoose')



const placeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },   
    address: {
        type: String,
        required: true
    },    
    description: {
        type: String
    },
    province: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Category'    
    },
    mainImageName: {
        type: Buffer,
        required: true    
    },
    mainImageType: {
        type: String,
        required: true    
    },
    creartedAt: {
        type: Date,
        required: true,
        default: Date.now
    }    
})

placeSchema.virtual('mainImagePath').get(function(){
    if(this.mainImageName != null && this.mainImageType != null) {
        return `data:${this.mainImageType};charset=utf-8;base64,${this.mainImageName.toString('base64')}`
    }
})

module.exports = mongoose.model('Place', placeSchema)
