import StudentModel from "../models/StudentModel.js";

export default {
    async getAll(req,res){
        const data = await StudentModel.getAll();
        res.json(data);
    },

    async getOne(req,res){
        const data = await StudentModel.getById(req.params.id);
        res.json(data);
    },

    async create(req,res){
        const profileUrl = req.file ? req.file.path : null;

        const data = {
            stu_name:req.body.stu_name,
            gender:req.body.gender,
            email:req.body.email,
            profile:profileUrl
        }

        const result = await StudentModel.create(data); 
        res.json(result);
    },

    async update(req,res){
        const profileUrl = req.file ? req.file.path : req.body.prof
        const data = {
            stu_name:req.body.stu_name,
            gender:req.body.gender,
            email:req.body.email,
            profile:profileUrl
        }
         const result = await StudentModel.update(req.params.id, data); 
        res.json(result);
    },

    async remove(req,res){
        await StudentModel.delete(req.params.id);
        res.json({message: "delete student successfuly"})
    }
}