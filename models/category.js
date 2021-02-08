const { text } = require('body-parser')
const { Int32 } = require('bson')
const mongoose = require('mongoose')
const Place = require('./place')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String        
    }
})
categorySchema.pre('remove', function(next) {
    Place.find({ category: this.id }, (err, books) => {
      if (err) {
        next(err)
      } else if (books.length > 0) {
        next(new Error('Ainda há Lugares com essa Categoria'))
      } else {
        next()
      }
    })
  })

module.exports = mongoose.model('Category', categorySchema)