const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    DsSanPham:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'OrderItem',
        required:true
    }],
    DiaChiGiaoHang:{
        type:String,
        required:true
    },
    MaBuuDien:{
        type:String,
        required:true
    },
    SoDienThoai:{
        type:String,
        required:true
    },
    TrangThai:{
        type:String,
        required:true,
        default:'ChuaGiaiQuyet',
    },
    TongTien:{
        type:Number
    },
    TaiKhoan:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    NgayMua:{
        type:Date,
        default:Date.now,
    }
})



exports.Order = mongoose.model('Order',orderSchema);