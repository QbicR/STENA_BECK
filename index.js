import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import cors from 'cors'

import { registerValidation, loginValidation } from './validations/auth.js'
import { postCreateValidation } from './validations/post.js'
import { PostController, UserController } from './controllers/index.js'
import { checkAuth, handleValidationErrors } from './utils/index.js'

mongoose
    .set('strictQuery', false)
    .connect(MONGO_URL || 'mongodb://admin:IL7S2KLwNbl95Sz1@SG-handy-lungSTENAe-3610-55711.servers.mongodirector.com:27017/admin')
    .then(() => console.log('DB connected'))
    .catch((error) => console.log('DB error', error))

const app = express()

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({ storage })

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.get('/tags', PostController.getAllTags)

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)
app.delete('/posts/:id', checkAuth, PostController.remove)

app.listen(process.env.PORT || 4444, (error) => {
    if (error) {
        return console.log(error);
    }

    console.log('Working...');
})



