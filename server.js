let express = require('express')

//Création de l'objet express dans la variable app pour créer notre serveur
let app = express()

//**** MOTEUR DE TEMPLATES ****/

//Chargement du module de template views "ejs" 
app.set('view engine', 'ejs')

//**** MIDDLEWARES ****/

//Définition de la mathode static pour charger notre css
app.use('/assets', express.static('public'))
//Appelle de la méthode express.json pour parser les données en POST
app.use(express.json())
//et étendre l'encodage à TRUE
app.use(express.urlencoded({ extended: true }))
//Creation d'une session grâce au middleware express-session
let session = require('express-session')
//Configuration de la session
app.use(session({
    secret: 'test',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
//Creation d'un middleware pour le flash d'erreur
app.use(require('./middlewares/flash'))

//Definition de la root et affichage de la view 
app.get('/', (request, response) => {
    //Affichage de l'erreur en page d'accueil
    /* if (request.session.error){
        //response.locals.error = request.session.error
        request.session.error = undefined
    } */
    //console.log(request.session)
    //On instancifie la class message
    let Message = require('./models/message')
    //Méthode all() qui récupère tous les messages!
    Message.all(function (messages) {
        //Dossier de notre views où seront placés tous nos fichiers pages/index
        response.render('pages/index', {messages: messages})
    })
})

//****/ ROUTES ****

//Gestion des requêtes POST sur la page accueil "/"
app.post('/', (request, response) => {
    if (request.body.message === "" || request.body.message === undefined) {
        //stockage de la variable error dans la session
        // request.session.error = "Il y a une erreur"

        //Affichage flash de l'erreur
        request.flash('error', "Vous n\'avez pas posté de messages!")
        //redirection en page d'accueil si message vide
        response.redirect('/')

    } else {
        let Message = require('./models/message')
        //On sauvegarde les infos dans une BDD
        Message.create(request.body.message, () => {
            request.flash('success', "Merci !")
            //redirection en page d'accueil dès que le message est envoyé
            response.redirect('/')
        })
    }

})

app.get('/message/:id', (request, response) =>{
    let Message = require('./models/message')
    Message.find(request.params.id, (message)=>{
        response.render('messages/show', {message:message})
    })
})

//Définition du port 8080 sur lequel on va executer nos requêtes
app.listen(8081)