export function errorHandle(err,req,res,next){
    res.json({
        status : err.status || 500,
        message : err.message
    })
}