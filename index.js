const {initializeData} = require('./db/db.connect')

initializeData()

require('dotenv').config()

const express = require('express')

const app = express()

app.use(express.json())

const cors = require('cors')

const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200
}

app.use(cors(corsOptions))

const PORT = process.env.PORT || 3000

const Hotel = require('./models/hotels.model')

//read all hotels

async function readAllHotels(){

    try {

        const allHotels = await Hotel.find()

        return (allHotels) 
        
    } catch (error) {

        console.log("Failed to fetch hotels", error)
        
    }
}



app.get('/hotels', async (req, res) => {

    try {

        const hotel = await readAllHotels()

        if(hotel != 0){

            res.json(hotel)
        }else{

            res.status(404).json({error: "Hotel not found"})
        }
      

            
        
        
    } catch (error) {

        res.status(500).json({error: "Failed to fetch hotels."})
        
    }
})


//read hotel by title

async function readHotelByTitle(hotelTitle){

    try {

        const hotelByTitle = await Hotel.findOne({name: hotelTitle})

        return hotelByTitle
        
    } catch (error) {
        console.log("Failed to fetch hotels", error)
    }
}

app.get('/hotels/:hotelName', async (req, res) => {

    try {

        const hotel = await readHotelByTitle(req.params.hotelName)

        if(!hotel){

            res.status(404).json({error: "Hotel Not Found"})
        }else{
            res.json(hotel)
        }
        
    } catch (error) {
        res.status(500).json({error: "Failed to fetch hotels"})
    }
})


//create a new hotel

async function createHotel(newHotel){

    try {

        const addHotel = new Hotel(newHotel)

        const saveData = await addHotel.save()

        return saveData

    } catch (error) {

        throw error
        
    }
}

app.post('/hotels', async (req, res) => {

    try {

        const hotel = await createHotel(req.body)

        if(!hotel){
            res.status(404).json({error: "Failed to add new hotel"})
        }else{

            res.status(201).json({message: "Hotel added successfully", addedHotel: hotel})
        }
        
    } catch (error) {
            res.status(500).json({error: "Failed to add new hotel"})
    }
})

//delete hotel by id

async function deleteHotel(hotelId){

    try {

        const deletedHotel = await Hotel.findByIdAndDelete(hotelId)

        return deletedHotel
    } catch (error) {
        console.log("Failed to fetch hotel", error)
    }
}

app.delete('/hotels/:hotelId', async (req, res) => {

    try {

        const deletedHotel = await deleteHotel(req.params.hotelId)

        if(deletedHotel){

            res.json({message: "Hotel deleted successfully"})
        }else{
            res.json({error: "Hotel not found"})
        }
        
    } catch (error) {
        
        res.status(500).json({error: "Failed to delete hotel"})
    }
})


app.listen(PORT, () => {

    console.log(`Server is running on port ${PORT}`)
})