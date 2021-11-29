const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    SoLuong:{
        type:Number,
        required:true
    },
    SanPham:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    }
})

orderItemSchema.virtual('id').get(function (){
    return this._id.toHexString();
})

orderItemSchema.set('toJSON',{
    virtuals: true
})

exports.OrderItem = mongoose.model('OrderItem',orderItemSchema);