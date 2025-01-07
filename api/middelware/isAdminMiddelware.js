exports.isLogin = async(req,res,next)=>{
    try {
        if(req.session.user_id && req.session.is_active == true){
        }else{
          return  res.redirect('/backend')
        }
        next()
    } catch (error) {
        console.log(error.message)
    }
}

exports.isLogout = async(req,res,next)=>{
    try {
        if(req.session.user_id && req.session.is_active == true){
           return res.redirect('/backend/dashboard')
        }
        next()
    } catch (error) {
        console.log(error.message)
    }
}