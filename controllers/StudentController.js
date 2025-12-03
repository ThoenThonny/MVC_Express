import StudentModel from "../models/StudentModel.js";
import { v2 as cloudinary } from "cloudinary";

export default {
    async getAll(req, res){
        const data = await StudentModel.getAll();
        res.json(data);
    },

    async getOne(req, res){
        const data = await StudentModel.getById(req.params.id);
        res.json(data);
    },

    async create(req, res){
        try {
            const profileUrl = req.file ? req.file.path : null;

            const data = {
                stu_name: req.body.stu_name,
                gender: req.body.gender,
                email: req.body.email,
                profile: profileUrl
            }

            const result = await StudentModel.create(data); 
            res.json(result);
        } catch (error) {
            console.error("Error creating student:", error);
            
            // If error and file was uploaded, delete it from Cloudinary
            if (req.file) {
                const urlParts = req.file.path.split('/');
                const fileNameWithExtension = urlParts[urlParts.length - 1];
                const fileName = fileNameWithExtension.split('.')[0];
                const folder = urlParts[urlParts.length - 2];
                const publicId = `${folder}/${fileName}`;
                await cloudinary.uploader.destroy(publicId);
            }
            
            res.status(500).json({ 
                message: "Error creating student", 
                error: error.message 
            });
        }
    },

    async update(req, res){
        try {
            // Check if student exists FIRST
            const existingStudent = await StudentModel.getById(req.params.id);
            
            if (!existingStudent) {
                // Student not found - delete newly uploaded file if exists
                if (req.file) {
                    const urlParts = req.file.path.split('/');
                    const fileNameWithExtension = urlParts[urlParts.length - 1];
                    const fileName = fileNameWithExtension.split('.')[0];
                    const folder = urlParts[urlParts.length - 2];
                    const publicId = `${folder}/${fileName}`;
                    
                    await cloudinary.uploader.destroy(publicId);
                }
                
                return res.status(404).json({ 
                    message: "Student not found" 
                });
            }

            let profileUrl;

            // If new file is uploaded
            if (req.file) {
                // Delete old image from Cloudinary if it exists
                if (existingStudent.profile) {
                    const urlParts = existingStudent.profile.split('/');
                    const fileNameWithExtension = urlParts[urlParts.length - 1];
                    const fileName = fileNameWithExtension.split('.')[0];
                    const folder = urlParts[urlParts.length - 2];
                    const publicId = `${folder}/${fileName}`;
                    
                    await cloudinary.uploader.destroy(publicId);
                }
                // Use new uploaded image
                profileUrl = req.file.path;
            } else {
                // Keep existing image
                profileUrl = existingStudent.profile;
            }

            const data = {
                stu_name: req.body.stu_name,
                gender: req.body.gender,
                email: req.body.email,
                profile: profileUrl
            }

            const result = await StudentModel.update(req.params.id, data); 
            res.json({
                message: "Student updated successfully",
                data: result
            });
        } catch (error) {
            console.error("Error updating student:", error);
            
            // If error and new file was uploaded, delete it from Cloudinary
            if (req.file) {
                const urlParts = req.file.path.split('/');
                const fileNameWithExtension = urlParts[urlParts.length - 1];
                const fileName = fileNameWithExtension.split('.')[0];
                const folder = urlParts[urlParts.length - 2];
                const publicId = `${folder}/${fileName}`;
                await cloudinary.uploader.destroy(publicId);
            }
            
            res.status(500).json({ 
                message: "Error updating student", 
                error: error.message 
            });
        }
    },

    async remove(req, res){
        try {
            // Get student data first
            const student = await StudentModel.getById(req.params.id);
            
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }

            // Delete from Cloudinary if profile exists
            if (student.profile) {
                const urlParts = student.profile.split('/');
                const fileNameWithExtension = urlParts[urlParts.length - 1];
                const fileName = fileNameWithExtension.split('.')[0];
                const folder = urlParts[urlParts.length - 2];
                const publicId = `${folder}/${fileName}`;
                
                await cloudinary.uploader.destroy(publicId);
            }

            // Delete from database
            await StudentModel.delete(req.params.id);
            
            res.json({ 
                message: "Student and profile image deleted successfully" 
            });
        } catch (error) {
            console.error("Error deleting student:", error);
            res.status(500).json({ 
                message: "Error deleting student", 
                error: error.message 
            });
        }
    }
}