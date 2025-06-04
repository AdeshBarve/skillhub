
const errorController=(error,req,res,next)=>{
    console.log("Error Middleware",error.message);
    res.status(error.status).json({success : false,
        message:error.message,
    });
}

module.exports={errorController};