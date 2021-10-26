const UserAuthenController = require('./controllers/UserAuthenController')
const UserController = require('./controllers/UserController')
const isAuthenController = require('./authen/isAuthenControllers')
const BlogController = require('./controllers/BlogController')
const CommentController = require('./controllers/CommentController')
let multer = require("multer")

let storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./public/uploads");
  },
  filename: function(req, file, callback) {
    console.log(file);
    callback(null, file.originalname);
  }
})
let upload = multer({storage: storage}).array("userPhoto", 10)

module.exports = (app) => {
  /* RESFUL Api for users management */
  // create user
  app.post('/user',UserController.create)
  app.put('/user/:userId',UserController.put)
  app.delete('/user/:userId',UserController.remove)
  app.get('/user/:userId',UserController.show)
  app.get('/users',isAuthenController,UserController.index)
  app.post('/login',UserAuthenController.login)
  app.post('/blog',BlogController.create)
  app.put('/blog/:blogId',BlogController.put)
  app.delete('/blog/:blogId',BlogController.remove)
  app.get('/blog/:blogId',BlogController.show)
  app.get('/blogs',BlogController.index)

// comment router
    //create comment
    app.post('/comment',CommentController.create)

  // edit comment, suspend, active
  app.put('/comment/:commentId',CommentController.put)

  // delete comment
  app.delete('/comment/:commentId',CommentController.remove)

  // get comment by id
  app.get('/comment/:commentId',CommentController.show)

  // get all comment
  app.get('/comments',CommentController.index)

  app.post("/upload", function(req, res) {
    // isUserAuthenticated
        upload(req, res, function(err) {
          if(err){
          return res.end("Error uploading file");
          }
          res.end("File is uploaded");
        })
      })
  
    //delete flie uploaded function
    app.post('/upload/delete', async function (req, res) {
      try {
        const fs = require('fs');
  
        console.log(req.body.filename)
        fs.unlink(process.cwd() + '/public/uploads/' + req.body.filename,
        (err) => {
          if (err) throw err;
          res.send("Delete sucessful")
          // conlose.log('successfully deleted material file');
        });
      } catch (err) {
          res.status(500).send({
            error: 'An error has occured trying to delete file the material'
          })
      }
    })

}