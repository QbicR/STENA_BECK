import { body } from 'express-validator'

export const loginValidation = [
    body('email', 'Неверный формат email').isEmail(),
    body('password', 'Пароль должен быть длиннее 5 символов').isLength({ min: 5 }),
]

export const registerValidation = [
    body('email', 'Неверный формат email').isEmail(),
    body('password', 'Пароль должен быть длиннее 5 символов').isLength({ min: 5 }),
    body('fullName', 'Имя должно быть длиннее 4 символов').isLength({ min: 4 }),
    body('avatarUrl', 'Неверная ссылка на изображение').optional().isURL(),
]