const product = require('../models/product');
const Product = require('../models/product')

const getAllProducts = async (req , res) => {
    const {company , name , featured , sort , select} = req.query;
    const queryObject = {};

    if (company) {
        queryObject.company = company;
    }

    if (featured) {
        queryObject.featured = featured;
    }

    if (name) {
        queryObject.name = { $regex: name  , $options: "i" };
    }

    let apiData = product.find(queryObject);

    if (sort) {
        let sortFix = sort.replace("," , " ");
        apiData = apiData.sort(sortFix);
    }

    if (select) {
        // let selectFix = select.replace("," , " ");
        let selectFix = select.split(",").join(" ");
        apiData = apiData.select(selectFix);
    }

    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 3;

    let skip = (page - 1) * limit; // new page will not have data of previous page so skip stores that count of previous page data

    apiData = apiData.skip(skip).limit(limit); //skipped previous data and showed limit sized data

    const myData = await apiData;
    res.status(200).json({ myData , nbHits: myData.length });
}

const getAllProductsTesting = async (req , res) => {
    //const myData = await Product.find( req.query ).sort("name -price"); 
    const myData = await Product.find( req.query ).select("name"); 
    res.status(200).json({ myData });
}

module.exports = { getAllProducts , getAllProductsTesting };