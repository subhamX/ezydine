import Express from 'express'
import spot from './routes/spot'

const app = Express();

app.use(Express.json())
app.use('/spot/', spot);


app.get('/', (req, res) => {
    res.send({
        status: 'OK',
        message: 'Hello World'
    })
})


app.listen(8000, () => {
    console.log(`Listening on Port 8000`)
})