import Post from '../models/Post.js'

export const getAll = async (req, res) => {
    try {
        const posts = await Post.find().populate('author').exec()

        res.json(posts)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить посты'
        })
    }
}

export const getAllTags = async (req, res) => {
    try {
        const posts = await Post.find().limit(5).exec()

        const tags = posts
            .map(post => post.tags)
            .flat()
            .slice(0, 5)

        res.json(tags)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить тэги'
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id

        Post.findOneAndUpdate(
            {
                _id: postId
            },
            {
                $inc: { viewsCount: 1 }
            },
            {
                returnDocument: 'after'
            },
            (err, doc) => {
                if (err) {
                    console.log(error);
                    return res.status(500).json({
                        message: 'Не удалось вернуть пост'
                    })
                }
                if (!doc) {
                    return res.status(404).json({
                        message: 'Пост не найден'
                    })
                }
                res.json(doc)
            }
        ).populate('author')
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить посты'
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new Post({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            author: req.userId,
        })

        const post = await doc.save()

        res.json(post)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось создать пост'
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id

        Post.findOneAndDelete(
            {
                _id: postId
            },
            (err, doc) => {
                if (err) {
                    console.log(error);
                    return res.status(500).json({
                        message: 'Не удалось удалить пост'
                    })
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Пост не найден'
                    })
                }

                res.json({
                    success: true
                })
            }
        )

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить посты'
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id

        await Post.updateOne(
            {
                _id: postId
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags.split(','),
                author: req.userId,
            }
        )

        res.json({
            success: true
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось обновить пост'
        })
    }
}