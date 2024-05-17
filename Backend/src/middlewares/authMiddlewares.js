
const authMiddleware = (req, res, next) => {

    if (req.session.username) {
        next();
    } else {
         // eğer username yoksa login sayfasına yönlendirilicek.
         return res.redirect('/login');
    }
}

const logMiddleware = (req,res,next)=>{
    if (req.session.username) {
        return res.redirect('/index');
    } else {
         next();
    }
}
module.exports = {authMiddleware, logMiddleware};