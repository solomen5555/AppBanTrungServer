const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    Ten:{
        type:String,
        required:false,
        default:''
    },
    TaiKhoan:{
        type:String,
        required:true,
        unique:true
    },
    MatKhau:{
        type:String,
        required:true
    },
    SoDienThoai:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    DiaChiGiaoHang1:{
        type:String,
        default:''
    },
    DiaChiGiaoHang2:{
        type:String,
        default:''
    },
    DiaChi:{
        type:String,
        default:''
    },
    MaBuuDien:{
        type:String,
        default:''
    },
    PhuongXa:{
        type:String,
        default:''
    },
    QuanHuyen:{
        type:String,
        default:''
    },
    TinhTP:{
        type:String,
        default:''
    },
    DatNuoc:{
        type:String,
        default:''
    }
})

userSchema.virtual('id').get(function (){
    return this._id.toHexString();
})

userSchema.set('toJSON',{
    virtuals: true
})

exports.User = mongoose.model('User',userSchema);