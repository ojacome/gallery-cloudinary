const { Router } = require("express");
const Photo = require('../models/Photo.model')
const cloudinary = require('cloudinary')
const fs = require('fs-extra');


//configuracion cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME || '', 
    api_key:  process.env.CLOUDINARY_API_KEY || '', 
    api_secret:  process.env.CLOUDINARY_API_SECRET || '' 
});



const router = Router();

router.get('/', async (req, res) => {
    const photos = await Photo.find().sort().lean();    
    res.render('images', {photos});
});

router.get('/images/add', async (req, res) => {
    const photos = await Photo.find().sort().lean();
    res.render('image_form', {photos});
});

router.post('/images/add', async (req, res) => {    
    // console.log(req.body);
    // console.log(req.file);
    const { title, description } = req.body;
    const result = await cloudinary.v2.uploader.upload(req.file.path).catch( err => console.log(err));
    
    const newPhoto = new Photo({
        title,
        description,
        imageUrl: result.url,
        public_id: result.public_id
    })

    await newPhoto.save().catch( err => console.log(err));
    await fs.unlink(req.file.path).catch( err => console.log(err));
     res.redirect('/');
});

// eliminar foto de base y de cloudinary
router.get('/images/delete/:id', async (req, res) => {
    const { id } = req.params;    
    const photoDelete = await Photo.findByIdAndDelete(id).catch( err => console.log(err));
    const result = await cloudinary.v2.uploader.destroy(photoDelete.public_id).catch( err => console.log(err));
    res.redirect('/');
});

module.exports = router;