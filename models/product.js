const mongoose = require('mongoose');


const productSchema = mongoose.Schema({
    Ten: {
        type: String,
        required: true
    },
    MoTa:{
        type: String,
        required:true
    },
    MoTaChiTiet:{
        type:String,
        default:''
    },
    Image: {
        type: String,
        default:''
    },
    Images:[{
        type:String
    }],
    ThuongHieu:{
        type:String,
        default:''
    },
    Gia:{
        type:Number,
        default:0
    },
    Loai:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    },
    TonKho:{
    type:Number,
       required:true,
       min :0,
       max:100000
    },
    XepHang:{
        type:Number,
        default:0
    },
    LuotDanhGia:{
        type:Number,
        default:0
    },
    AnTuong:{
        type:Boolean,
        default:false
    },
    NgayTao:{
        type:Date,
        default:Date.now
    }
})

productSchema.virtual('id').get(function (){
    return this._id.toHexString();
})

productSchema.set('toJSON',{
    virtuals: true
})

exports.Product = mongoose.model('Product',productSchema);