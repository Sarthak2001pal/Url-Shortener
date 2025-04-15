const { nanoid } = require("nanoid")
const URL =require("../models/url")

async function handleGenerateNewShortUrl(req,res) {
    const body = req.body
    if(!body.url) return res.status(400).json({error:"Enter a valid Url"})
    const shortId = nanoid(8)
    await URL.create({
        shortId : shortId,
        redirectUrl : body.url,
        visitHistory : [] 
    })
    
    return res.render("home",{
        id: shortId
    })
    // return res.json({id: shortId})
}

async function handleGetAnalytics(req,res) {
    const shortId = req.params.shortId
    try {
        const result = await URL.findOne({ shortId });
        
        if (!result) {
            return res.status(404).json({ error: "Short URL not found" });
        }
        
        return res.json({
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory
        });
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return res.status(500).json({ error: "Server error" });
    }
}

module.exports = {
    handleGenerateNewShortUrl,
    handleGetAnalytics
}