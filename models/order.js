const mongoose = require('mongoose')
var Schema = mongoose.Schema;

let orderSchema = new Schema({
    user: { type: String, required: true },
    order: {type: Array, required: true}
})

var Order = mongoose.model('Order', orderSchema);


async function placeOrder(prod){
    const order = new Order({
        user: prod.user,
        order: prod.order
    })
    let result;
    try{
        result = await order.save()
    }
    catch(err){
        result = err.message
    }
    console.log(result)
    return result
}

exports.Order = Order
exports.placeOrder = placeOrder