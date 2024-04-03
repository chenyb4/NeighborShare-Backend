const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    ownerEmail: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    apartmentNumber: {
        type: String,
        required: true
    },
    isAvailable: {
        type: Boolean,
        required: true,
        default: true
    },
    imageData: {
        type: Buffer, // Storing image data as a Buffer
        required: false
    }
});

module.exports = mongoose.model('Items', ItemSchema);
