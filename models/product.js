const mongoose = require('mongoose')

var Schema = mongoose.Schema;

// create a schema
let productSchema = new Schema({
    description: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    piece_rate: {type: Number, required: true},
    qty_per_unit: {type: Number, required: true}
})

var Product = mongoose.model('Product', productSchema);

async function addItem(prod){
    const product = new Product({
        description: prod.description,
        type: prod.type,
        piece_rate: prod.piece_rate,
        qty_per_unit: prod.qty_per_unit
    })
    let result;
    try{
        result = await product.save()
    }
    catch(err){
        result = err.message
    }
    console.log(result)
    return result
}

exports.Product = Product
exports.addItem = addItem