const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bestSellersSchema = new Schema({
	id: Number,
	quantity: Number
}, {
	collection: 'bestSellers'
})

// Crear modelo
module.exports = mongoose.model('BestSellers', bestSellersSchema);