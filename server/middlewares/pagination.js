export default function () {
    return function (req, res, next) {
        if(+req.query.limit === -1) {
            delete req.query.limit;
            delete req.query.offset;
            return next();
        }
        
        req.query.limit = parseInt(req.query.limit) || 50;
        req.query.offset = parseInt(req.query.offset) || 0;
        next();
    };
};
