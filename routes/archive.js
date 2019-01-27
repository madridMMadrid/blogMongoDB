const express = require('express');
const router = express.Router();
const moment = require('moment');
moment.locale('ru');

const config = require('../config');
const models = require('../models');



// Promise
function posts(req, res) {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;
  const perPage = +config.PER_PAGE;
  const page = req.params.page || 1;

  models.Post.find({})
    .skip(perPage * page - perPage)
		.limit(perPage)
		.populate('owner')
		.sort({createdAt: -1})
    .then(posts => {
      models.Post.count()
        .then(count => {
          res.render('archive/index', {
            posts,
            current: page,
            pages: Math.ceil(count / perPage),
            user: {
              id: userId,
              login: userLogin
            }
          });
        })
        .catch(() => {
					throw new Error('Server error')
				});
    })
    .catch(() => {
			throw new Error('Server error')
		});
}

// routers
// из app.js мы приходим сюда и при вызове главной страницы вызываем функцию posts которая генерирует нам контент
router.get('/', (req, res) => posts(req, res));
// при переходе на href="/archive/<%= Number(current) - 1 %>" у нас будет вызыватся тажа функция с нужным нам контентом
router.get('/archive/:page', (req, res) => posts(req, res));



// async await
router.get('/posts/:post', async (req, res, next) => {
    const url = req.params.post.trim().replace(/ +(?= )/g, '');
    const userId = req.session.userId;
		const userLogin = req.session.userLogin;
		
    if (!url) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    } else {
			try {
				const post = await models.Post.findOne({ url });
				
					if (!post) {
							const err = new Error('Not Found');
							err.status = 404;
							next(err);
					} else {

						const comments = await models.Comment.find({
							post: post.id,
							parent: { $exists: false }
						});
						
						res.render('post/post', {
							post,
							comments,
							moment,
							user: {
								id: userId,
								login: userLogin
							}
						});
					}
			} catch (error) {
				throw new Error('Server error')
			}
    }
});


// Promise
// router.get('/posts/:post', (req, res, next) => {
//     const url = req.params.post.trim().replace(/ +(?= )/g, '');
//     const userId = req.session.userId;
//     const userLogin = req.session.userLogin;

//     if (!url) {
//         const err = new Error('Not Found');
//         err.status = 404;
//         next(err);
//     } else {
//         models.Post.findOne({
//             url
//         }).then(post => {
//             if (!post) {
//                 const err = new Error('Not Found');
//                 err.status = 404;
//                 next(err);
//             } else {
// 							res.render('post/post', {
// 								post,
// 								user: {
// 									id: userId,
// 									login: userLogin
// 								}
// 							});
// 						}
//         })
//     }
// });

router.get('/users/:login/:page*?', async (req, res) =>{
	const userId = req.session.userId;
  const userLogin = req.session.userLogin;
  const perPage = +config.PER_PAGE;
	const page = req.params.page || 1;
	const login = req.params.login;

	try {
		const user = await models.User.findOne({ login });
		const posts = await models.Post.find({ owner: user.id })
			.skip(perPage * page - perPage)
			.limit(perPage)
			.populate('owner')
			.sort({createdAt: -1})
			const count = await models.Post.count({ owner: user.id })
				res.render('archive/user', {
					posts,
					_user: user,
					current: page,
					pages: Math.ceil(count / perPage),
					user: {
						id: userId,
						login: userLogin
					}
				});
	} catch (error) {
		throw new Error('Server error')
	}
});

module.exports = router;