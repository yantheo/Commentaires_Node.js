module.exports = function (request, response, next) {
    
    //On définit la variable error s'il y a un message flash dans la session
    if (request.session.flash){
        response.locals.flash = request.session.flash
        request.session.flash = undefined
    }
    //On définit la variable flash dans la session
    request.flash = function (type, content) {
        if (request.session.flash === undefined) {
            request.session.flash = {}
        }
        request.session.flash[type] = content
    }
    next()
}