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


app.listen(process.env.PORT, () => {
    console.log(`Listening on Port ${process.env.PORT}`)
})