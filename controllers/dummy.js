
const dummy = (req, res) =>{

    const query = req.query
    console.log(query)
    res.sendStatus(200)

}

module.exports = dummy