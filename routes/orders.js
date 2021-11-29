const express = require('express');
const router = express.Router();
const {Order} = require('../models/order');
const { OrderItem } = require('../models/orderItem');

router.get(`/`, (req,res)=>{
     Order.find().populate('TaiKhoan','Ten').sort({'NgayMua':-1}).then(orderList=>{
        if(orderList.length<=0){
           return res.status(404).json({
                success:false,
                message:"chưa có hóa đơn nào"
            })
        }
       return res.status(200).json({
           success:true,
           message:"lấy danh sách hóa đơn thành công",
           response:orderList
       });
     }).catch(err=>{
         return res.status(400).json({
             success:false,
             message:'',
             error:err
         })
     })
    
})

router.get(`/:id`, (req,res)=>{
     Order.findById(req.params.id).populate('TaiKhoan','Ten')
     .populate({path:'DsSanPham',populate:{path :'SanPham',populate:'Loai'}})
     
     .then(order=>{
        if(!order){
          return  res.status(404).json({
                success:false,
                message:"hóa đơn không tồn tại"
            })
        }
     return  res.status(200).json({
         success:true,
         message:'Tìm thấy hóa đơn',
         response:order
     });
     }).catch(err=>{
         return res.status(400).json({
             success:false,
             message:'',
             error:err
         })
     })
   
})

router.get(`/get/tongmua`, (req,res)=>{
     Order.aggregate([
        { $group:{_id : null, tongmua : { $sum : '$TongTien' }}}
    ]).then(tongMua=>{
        if(!tongMua){
            return res.status(404).send.json({
                success:false,
                message:'Chưa có hóa đơn được tạo'
            })
        } 
        return res.status(200).json({
            success:true,
            tongmua: tongMua.pop().tongmua,
            message:'lấy tổng tiền mua thành công'
        })
    }).catch(err=>{
        return res.status(400).json({
            success:false,
            message:'',
            error:err
        })
    })

    
})

router.get('/get/count',(req,res)=>{
    Order.countDocuments().then(orderCount=>{
        if(!orderCount){
            return res.status(500).json({
                success:false,
                message: ""
            })
            
        }
        return res.status(200).json({
            success:true,
            message:'lấy số lượng thành công',
            response:orderCount
        })
    }).catch(err=>{
        return res.status(400).json({
            success:false,
            message:'',
            error:err
        })
    })
})

router.post(`/`, async (req,res)=>{
    const DsSanPham = Promise.all( req.body.DsSanPham.map(async ds=>{
        let NewDs = new OrderItem({
            SoLuong : ds.SoLuong,
            SanPham : ds.SanPham
        })
        
        NewDs = await NewDs.save();
        return NewDs._id;

    }))

    const DsSanPham1 = await DsSanPham;

    const TongTien = await Promise.all(DsSanPham1.map(async dsId =>{
        const ds = await OrderItem.findById(dsId).populate('SanPham','Gia')
        const tongTien = ds.SanPham.Gia * ds.SoLuong;
        return tongTien;
    }))

    const TongTien1 = TongTien.reduce((a,b)=>a + b,0);

    let order = new Order({
        DsSanPham:DsSanPham1,
        DiaChiGiaoHang:req.body.DiaChiGiaoHang,
        MaBuuDien:req.body.MaBuuDien,
        SoDienThoai:req.body.SoDienThoai,
        TrangThai:req.body.TrangThai,
        TongTien:TongTien1,
        TaiKhoan:req.body.TaiKhoan
    })

      order.save().then(order=>{
        if(!order){
            return res.status(404).json({
                success:false,
                message:'thêm thất bại'
            });
        }
    
      return  res.status(201).json({
            success:true,
            message:'thêm thành công',
            response:order
        });
     }).catch(err=>{
         return res.status(400).json({
             success:false,
             message:'',
             error:err
         })
     })
       
})


router.put('/:id', (req,res)=>{
    Order.findByIdAndUpdate(req.params.id,{
       TrangThai:req.body.TrangThai
        
    },{
        new:true
    }).then(order =>{
        if(!order){
            return res.status(404).json({
                success:false,
                message:'sản phẩm chưa tồn tại'
            })
        }
    
        res.status(201).json({
            success:true,
            message:'sửa thành công',
            response:order
        })
    }).catch(err=>{
        return res.status(400).json({
            success:false,
            message:'',
            error:err
        })
    })
})

router.delete('/:id', (req,res)=>{
    Order.findByIdAndDelete(req.params.id).then(async order=>{
        if(!order){
            return res.status(404).json({
                success:false,
                message:'sản phẩm không tồn tại'
            })

        }
       else{
           await order.DsSanPham.map( async ds =>{
               await OrderItem.findByIdAndDelete(ds)
           })
        return res.status(200).json({
            success:true,
            message:'xóa thành công'
        })
       } 
    }).catch(err=>{
        return res.status(400).json({
            success:false,
            message: " ",
            error:err 
        })
    })
})

module.exports = router;