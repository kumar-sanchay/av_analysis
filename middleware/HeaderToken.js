
const HeaderToken = (req, res, next) => {
    
    const headers = req.headers
    next()
}

module.exports = HeaderToken