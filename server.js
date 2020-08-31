const express = require('express')
const app = express()
const PORT = process.env.PORT || 8080

app.use(express.static(__dirname + '/dist/myVideoCall'))

app.get('/*', (req, res) => { res.sendFile(__dirname + '/dist/myVideoCall/index.html') })

app.listen(PORT, () => { console.log(`Servidor ativo na porta ${ PORT }`) })