const express = require('express');
const router = express.Router();
const {Category} = require('../models/category');

router.get(`/`, (req,res)=>{
     Category.find().then(categoryList=>{
        if(categoryList.length <= 0){
         return   res.status(404).json({
                success:false,
                message:' '
            })
        }
     return  res.status(200).json({
            success:true,
            message:'lấy thành công',
            response:categoryList
        });
     }).catch(err=>{
         return res.status(400).json({
             success:true,
             message:'',
             error:err
         })
     })
    
})

router.get(`/:id`, (req,res)=>{
      Category.findById(req.params.id).then(category=>{
        if(!category){
        return    res.status(404).json({
                success:false,
                message:'không tìm thấy'
            })
        } 
    return  res.status(200).json({
            success:true,
            message:'tìm thấy 1 phân loại',
            response:category
        })
     }).catch(err=>{
        return res.status(400).json({
            success:false,
            message:' ',
            error:err
        })
     })
    

})

router.post(`/`, (req,res)=>{
    const category = new Category({
        Ten: req.body.Ten,
        Icon: req.body.Icon,
        Color:req.body.Color
    })

      category.save().then(category=>{
        if(!category){
            return res.status(404).json({
                success:false,
                message:'thêm thất bại'
            });
        }
    
      return  res.status(201).json({
            success:true,
            message:'thêm thành công',
            response:category
        });
     }).catch(err=>{
         return res.status(400).json({
             success:false,
             message:'',
             error:err
         })
     })
    
   
    
})


router.delete('/:id',async (req,res)=>{
    Category.findByIdAndRemove(req.params.id).then(category =>{
        if(category){
            return res.status(200).json({
                success:true,
                message:'xóa thành công'
            })
        } else {
            return res.status(404).json({
                success:false,
                message:'xóa thất bại'
            })
        }
    }).catch(err =>{
        return res.status(400).json({
            success:false,
            message:'xóa thất bại',
            error:err
        })
    })
} )

router.put(`/:id`,  (req,res) =>{
      Category.findByIdAndUpdate(req.params.id,{
        Ten:req.body.Ten,
        Icon:req.body.Icon,
        Color:req.body.Color
    },{
        new:true
    }).then(category =>{
        if(!category){
            return res.status(404).json({
                success:false,
                message:'phân loại chưa tồn tại'
            })
        }
    
        res.status(201).json({
            success:true,
            message:'sửa thành công',
            response:category
        })
    }).catch(err=>{
        return res.status(400).json({
            success:false,
            message:'',
            error:err
        })
    })

    

} )

module.exports = router;