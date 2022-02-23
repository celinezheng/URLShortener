// packages needed in this file
const express = require('express')
const validUrl = require('valid-url')
const shortid = require('shortid')

// creating express route handler
const router = express.Router()

// import the Url database model
const Url = require('../models/url')

// @route    POST /api/url/shorten
// @description     Create short URL

// The API base Url endpoint
const production  = 'https://dcard-url-shortener.herokuapp.com/';
const development = 'http:localhost:5000';
const baseUrl = (process.env.NODE_ENV ? production : development);
router.post('/shorten', async (req, res) => {
    // destructure the longUrl from req.body.longUrl
    const longUrl= req.body.longUrl; 
    const expired_date= req.body.expired_date;

    // check base url if valid using the validUrl.isUri method
    if (!validUrl.isUri(baseUrl)) {
        return res.status(401).json('Invalid base URL')
    }

    // if valid, we create the url code
    const urlCode = shortid.generate()
    
    // check long url if valid using the validUrl.isUri method
    if (typeof validUrl.isUri(longUrl) !== 'undefined') {
        try {
            /* The findOne() provides a match to only the subset of the documents 
            in the collection that match the query. In this case, before creating the short URL,
            we check if the long URL was in the DB ,else we create it.
            */
            let url = await Url.findOne({
                longUrl
            })
            console.log('new date');
            console.log(expired_date);
            // url exist and return the respose
            if (url) {
                res.json(url)
            } else {
                // join the generated short code the the base url
                const shortUrl = baseUrl + '/' + urlCode

                // invoking the Url model and saving to the DB
                url = new Url({
                    longUrl,
                    shortUrl,
                    urlCode,
                    date: new Date(),
                    expired_date: new Date(expired_date)
                });
                console.log(url);
                await url.save()
                res.json(url)
            }
        }
        // exception handler
        catch (err) {
            console.log(err)
            res.status(500).json('Server Error')
        }
    } else {
        res.status(401).json('Invalid longUrl')
    }
})

module.exports = router