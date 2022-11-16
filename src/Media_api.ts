const express = require('express')
const port = 15150
import console from "./Console"

class Media_api{
    app;
    constructor(){
        this.app = express()
        this.app.use(express.static('public'))
        this.app.listen(port, () => {
            console.info(`api start on rostro15.fr:${port}`)
          })

    }
}
export{}
module.exports = Media_api;