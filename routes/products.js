const express = require('express');
const router = express.Router();
const {Product} = require('../models/product');
const multer = require('multer');
const { mongoose } = require('mongoose');


const FILE_TYPE_MAP = {
    'image/png':'png',
    'image/jpeg':'png',
    'image/jpg':'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('Ảnh không hợp lệ')
        if(isValid){
            uploadError = null
        }

      cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
      const fileName = file.originalname.split(' ').join('-');
      const extenstion = FILE_TYPE_MAP[file.mimetype]
      cb(null, `${fileName}-${Date.now()}.${extenstion}`)
    }
  })

  const uploadOptions = multer({ storage: storage })

router.get(`/`, (req,res)=>{
    // api/v1/products?categories=123,345;
let filter = {};
if(req.query.categories){
    filter = {Loai: req.query.categories.split(',')};
}

     Product.find(filter).populate('Loai').then(productList=>{
        if(productList.length <= 0){
       return  res.status(500).json({
                success:false,
                message:'không lấy được danh sách sản phẩm'
            })
        }
       return res.status(200).json({
           success:true,
           message:'lấy danh sách sản phẩm thành công',
           response:productList
       });
     }).catch(err=>{
         return res.status(400).json({
             success:false,
             message:'',
             error:err
         })
     })
    
})

router.get('/:id',(req,res)=>{
    Product.findById(req.params.id).populate('Loai').then(product=>{
        if(!product){
            return res.status(404).json({
                success:false,
                message:'không tìm thấy sản phẩm'
            })
        }
        return res.status(200).json({
            success:true,
            message:'tìm thấy sản phẩm',
            response:product
        })
    }).catch(err=>{
        return res.status(400).json({
            success:false,
            message:' ',
            error:err
        })
    })
})

router.get('/get/count',(req,res)=>{
    Product.countDocuments().then(productCount=>{
        if(!productCount){
            return res.status(500).json({
                success:false,
                message: ""
            })
            
        }
        return res.status(200).json({
            success:true,
            message:'lấy số lượng thành công',
            response:productCount
        })
    }).catch(err=>{
        return res.status(400).json({
            success:false,
            message:'',
            error:err
        })
    })
})

router.get(`/get/Antuong`, (req,res)=>{
    let filter = {AnTuong : true}
    Product.find(filter).then(productList=>{
       if(productList.length <=0 ){
      return  res.status(404).json({
               success:false,
               message:'không lấy được danh sách sản phẩm'
           })
       }
      return res.status(200).json({
          success:true,
          message:'lấy danh sách sản phẩm thành công',
          response:productList
      });
    }).catch(err=>{
        return res.status(400).json({
            success:false,
            message:'',
            error:err
        })
    })
   
})

router.get(`/get/Antuong/:count`, (req,res)=>{
    const count = req.params.count ? req.params.count : 0;
    let filter ={AnTuong:true}
    Product.find(filter).limit(+count).then(productList=>{
       if(!productList){
      return  res.status(404).json({
               success:false,
               message:'không lấy được danh sách sản phẩm'
           })
       }
      return res.status(200).json({
          success:true,
          message:'lấy danh sách sản phẩm thành công',
          response:productList
      });
    }).catch(err=>{
        return res.status(400).json({
            success:false,
            message:'',
            error:err
        })
    })
   
})

router.post(`/`, uploadOptions.single('Image'),  (req,res)=>{
 
    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;
    
    const file = req.file;
    if(!file){
        return res.status(400).json({
        success:false,
        error:'ảnh chưa được chọn'
        })
    }

    const product = new Product({
        Ten :req.body.Ten,
        MoTa: req.body.MoTa,
        MoTaChiTiet: req.body.MoTaChiTiet,
        Image: `${basePath}${fileName}`,
        ThuongHieu: req.body.ThuongHieu,
        Gia:req.body.Gia,
        Loai:req.body.Loai,
        TonKho:req.body.TonKho,
        XepHang:req.body.XepHang,
        LuotDanhGia: req.body.LuotDanhGia,
        AnTuong: req.body.AnTuong,
    })
    product.save().then((createdProduct=>{
        if(!createdProduct){
            return res.status(404).json({
                success:false,
                message:"thêm mới sản phẩm thất bại"
            })
        }
        return  res.status(201).json({
            success:true,
            message:'thêm mới 1 sản phẩm',
            response:createdProduct
        })    
    })).catch((err)=>{
        res.status(400).json({
            error : err,
            success: false
        })
    })
})

router.put('/:id', (req,res)=>{
    Product.findByIdAndUpdate(req.params.id,{
        Ten :req.body.Ten,
        MoTa: req.body.MoTa,
        MoTaChiTiet: req.body.MoTaChiTiet,
        Image: req.body.Image,
        Images: req.body.Images,
        ThuongHieu: req.body.ThuongHieu,
        Gia:req.body.Gia,
        Loai:req.body.Loai,
        TonKho:req.body.TonKho,
        XepHang:req.body.XepHang,
        LuotDanhGia: req.body.LuotDanhGia,
        AnTuong: req.body.AnTuong,
        
    },{
        new:true
    }).then(product =>{
        if(!product){
            return res.status(404).json({
                success:false,
                message:'sản phẩm chưa tồn tại'
            })
        }
    
        res.status(201).json({
            success:true,
            message:'sửa thành công',
            response:product
        })
    }).catch(err=>{
        return res.status(400).json({
            success:false,
            message:'',
            error:err
        })
    })
})

router.put(`/Images/:id`,uploadOptions.array('Images',10), (req,res)=>{
    
    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;

    if(files){
       files.map(file =>{
         imagesPaths.push(`${basePath}${file.filename}`)  
       })
    }
   
    Product.findByIdAndUpdate(req.params.id,{
        Images:imagesPaths
    },
    {new : true}
    ).then(product =>{
        if(!product){
            return res.status(404).json({
                success:false,
                message:'thêm ảnh thất bại'
            })
        }
        return res.status(201).json({
            success:true,
            message:'thêm ảnh thành công',
            response:product
        })
    }).catch(err=>{
        return res.status(400).json({
            success:false,
            error:err
        })
    })

} )

router.delete('/:id',(req,res)=>{
    Product.findByIdAndDelete(req.params.id).then(product=>{
        if(!product){
            return res.status(404).json({
                success:false,
                message:'sản phẩm không tồn tại'
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