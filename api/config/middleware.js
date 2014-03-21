// make sure user is logged in
exports.requiresLogin = function (req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.json({
            'response': 'FAIL',
            'errors': ['Sign in required']
        });
    }
}
