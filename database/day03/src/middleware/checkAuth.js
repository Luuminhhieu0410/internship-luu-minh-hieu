import createHttpError from "http-errors";

export function checkAuth(req,res,next) {
    try {
        if(!req.header('Authorization')) return next(createHttpError(401,'Unathorized'));
        let token = req.header('Authorization').split(' ')[1];
        // res.send(token);
        // console.log('bearer token ' + token);
        if(!token) return next(createHttpError(401,'Unathorized'));
        if(token !== 'token123') return next(createHttpError(401,'Unathorized'));
        next()
        
    } catch (error) {
        next(error);
    }
}

