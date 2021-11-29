const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    Ten:{
        type:String,
        required:true
    },
    Icon:{
        type:String,
        default:''
    },
    Color:{
        type:String,
        default:''
    }
})

exports.Category = mongoose.model('Category',categorySchema);