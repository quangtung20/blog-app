import { Request, Response } from 'express'
import { IAuth } from '../interfaces/Auth'
import Categories from '../models/categoryModel'
import Blogs from '../models/blogModel'
const categoryCtrl={
    getCategory:async(req:IAuth,res:Response)=>{
        try {
            const categories = await Categories.find().sort('-createdAt')
            return res.status(200).json({
                categories
            })
        } catch (err:any) {
            return res.status(500).json({msg: err.message})
        }
    },
    createCategory:async(req:IAuth,res:Response)=>{
        try {
            const checkUser = req.user
            console.log(checkUser)
            if(!checkUser) {
                return res.status(400).json({msg: "Invalid Authentication."})
            }
            if(checkUser.role !=='admin'){
                return res.status(400).json({msg: "Invalid Authentication."})
            }
            const name = req.body.name.toLowerCase()

            const newCategory = new Categories({name})

            await newCategory.save()

            res.status(200).json({
                newCategory
            })


        } catch (err:any) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateCategory:async(req:IAuth,res:Response)=>{
        try {
            const checkUser = req.user
            if(!checkUser) {
                return res.status(400).json({msg: "Invalid Authentication."})
            }
            if(checkUser.role !=='admin'){
                return res.status(400).json({msg: "Invalid Authentication."})
            }
            await Categories.findOneAndUpdate({_id:req.params.id},{
                name:req.body.name.toLowerCase()
            })
            res.status(200).json({msg:'Update success'})
        } catch (err:any) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteCategory:async(req:IAuth,res:Response)=>{
        try {
            const checkUser = req.user
            if(!checkUser) {
                return res.status(400).json({msg: "Invalid Authentication."})
            }
            if(checkUser.role !=='admin'){
                return res.status(400).json({msg: "Invalid Authentication."})
            }
            const blog = await Blogs.findOne({category:req.params.id})
            if(blog){
                return res.status(400).json({
                    msg: "Can not delete! In this category also exist blogs."
                  })
            }
            const category = await Categories.findByIdAndDelete(req.params.id)
            if(!category){
                return res.status(400).json({msg: "Category does not exists."})
            }
            res.status(200).json({msg:'Delete success'})
        } catch (err:any) {
            return res.status(500).json({msg: err.message})
        }
    },
}

export default categoryCtrl