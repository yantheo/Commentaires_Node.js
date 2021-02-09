//On charge la connection qu'on a crée dans le module db 
let connection = require('../config/db')

//On instanfie le module moment pour parser la date
let moment = require('../config/moment')



class Message {
    constructor (row) {
        this.row = row
    }

    get id (){
        return this.row.id 
    }

    get content(){
        return this.row.content
    }

    get created_at(){
        return moment(this.row.created_at)
    }

    static create(content, cb) {
        connection.query('INSERT INTO messages SET content = ?, created_at = ?', [content, new Date()], function (error, results) {
            if (error) throw error
            cb(results)
        })
    }

    static all(cb){
        connection.query('SELECT * FROM messages', (err, rows)=>{
            if(err) throw err
            cb(rows.map((row)=> new Message(row)))
        })
    }

    static find(id, cb){
        connection.query('SELECT * FROM messages WHERE id = ? LIMIT 1', [id], (err, rows)=>{
            if(err) throw err
            cb(new Message(rows[0]))
        })
    }


}

module.exports = Message