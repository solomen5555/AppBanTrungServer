const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.get(`/`, (req,res) => {
    User.find().select('-MatKhau').then(userList=>{
        if(userList.length<=0){
          return  res.status(404).json({
                success:false,
                message:'danh sách tài khoản rỗng'
            })
        }
       return res.status(200).json({
           success:true,
           message:'lấy danh sách tài khoản thành công',
           response:userList
       });
    }).catch(err=>{
        return res.status(400).json({
            success:false,
            message:'',
            error:err
        })
    })
   
})

router.get(`/:id`, (req,res) => {
    User.findById(req.params.id).then(user=>{
        if(!user){
          return  res.status(404).json({
                success:false,
                message:'tài khoản chưa tồn tại'
            })
        }
       return res.status(200).json({
           success:true,
           message:'lấy thông tin tài khoản thành công',
           response:user
       });
    }).catch(err=>{
        return res.status(400).json({
            success:false,
            message:'',
            error:err
        })
    })
   
})

router.get('/get/count',(req,res)=>{
    User.countDocuments().then(userCount=>{
        if(!userCount){
            return res.status(500).json({
                success:false,
                message: ""
            })
            
        }
        return res.status(200).json({
            success:true,
            message:'lấy số lượng thành công',
            response:userCount
        })
    }).catch(err=>{
        return res.status(400).json({
            success:false,
            message:'',
            error:err
        })
    })
})

router.post(`/register`, (req,res)=>{
    const user = new User({
        Ten:req.body.Ten,
        TaiKhoan:req.body.TaiKhoan,
        MatKhau:bcrypt.hashSync(req.body.MatKhau,10),
        SoDienThoai:req.body.SoDienThoai,
        isAdmin:req.body.isAdmin,
        DiaChiGiaoHang1:req.body.DiaChiGiaoHang1,
        DiaChiGiaoHang2:req.body.DiaChiGiaoHang2,
        DiaChi:req.body.DiaChi,
        MaBuuDien:req.body.MaBuuDien,
        PhuongXa:req.body.PhuongXa,
        QuanHuyen:req.body.QuanHuyen,
        TinhTP:req.body.TinhTP,
        
    })

      user.save().then(user=>{
        if(!user){
            return res.status(404).json({
                success:false,
                message:'đăng ký thất bại'
            });
        }
    
      return  res.status(201).json({
            success:true,
            message:'đăng ký tài thành công',
            response:user
        });
     }).catch(err=>{
         return res.status(400).json({
             success:false,
             message:'',
             error:err
         })
     })
     
})

router.post('/login',(req,res)=>{
    let filter = {TaiKhoan:req.body.TaiKhoan};
    const secret = process.env.secret;
    User.findOne(filter).then(user=>{
        if(!user){
            return res.status(404).json({
                success:false,
                message:'tài khoản không tồn tại'
            })
        }

        if(user && bcrypt.compareSync(req.body.MatKhau,user.MatKhau)){
            const token = jwt.sign(
                {
                    userId: user.id,
                    isAdmin:user.isAdmin
            },
            secret,
            {expiresIn:'1d'}
            )
            return res.status(200).json({
                success:true,
                message:'đăng nhập thành công',
                response:{
                    TaiKhoan:user.TaiKhoan,
                    token:token
                }

            })
        }
        else{
            return res.status(204).json({
                success:false,
                message:'mật khẩu không chính xác'
            })
        }
    }).catch(err=>{
        return res.status(400).json({
            success:false,
            message:'',
            error:err
        })
    })
})

router.delete('/:id',(req,res)=>{
    User.findByIdAndDelete(req.params.id).then(user=>{
        if(!user){
            return res.status(404).json({
                success:false,
                message:'tài khoản không tồn tại'
            })

        }
        return res.status(200).json({
            success:true,
            message:'xóa thành công'
        })
    }).catch(err=>{
        return res.status(400).json({
            success:false,
            message: " ",
            error:err 
        })
    })
})

module.exports = router;