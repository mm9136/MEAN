var mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const movieSchema = new mongoose.Schema({
  id: {type: String, required: true}, // not a reference, used for identifying unique movies
  title: {type: String, required: true},
  year: {type: Number, required: true},
}, {_id: false});

const dvdRefShema = new mongoose.Schema({
  price: {type: Number, required: true}, // per item
  quantity: {type: Number, required: true, min: 0},
  name: {type: String, required: true},
  movies: [movieSchema]
}, {_id: false});

/**
 * @swagger
 * components:
 *  schemas:
 *    Bill:
 *      title: Bill
 *      type: object
 *      x-tags:
 *        - Bills
 *      properties:
 *        order_number:
 *          type: integer
 *        date:
 *          type: string
 *          format: date-time
 *        total:
 *          type: number
 *        dvd:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/DVD'
 *        user:
 *          $ref: '#/components/schemas/User'
 *        id_:
 *          type: string
 *      required:
 *        - total
 *        - user
 */
const billShema = new mongoose.Schema({
  order_number:{type: Number},
  date: {type: Date, default: Date.now},
  total:{type: Number,required: true},
  dvd: [dvdRefShema],
  user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
}, {_id: true});

billShema.plugin(AutoIncrement, {inc_field: "order_number", id: "bill_schema_seq"});

mongoose.model('Bill', billShema, 'Bills');



// {"order_number": 6, "date": Date(), "total": 69, "user": ObjectId("5fe25be7e10ea7132b58dcb4"),
// "dvd": [{"price": 10, "quantity": 3, "name": "The Time of Yura", "movies": [{"id": 3, "title": "Jurrassic Park 1", "year": 20}, {"id": 4, "title": "Jurrassic Park 2", "year": 23}]},
// {"price": 13, "quantity": 3, "name": "Hello There", "movies": [{"id": 1, "title": "Uno", "year": 201}, {"id": 2, "title": "Dos", "year": 232}]}]}