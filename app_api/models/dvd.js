var mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *  schemas:
 *    DVD:
 *      title: DVD
 *      type: object
 *      x-tags:
 *        - DVDs
 *      properties:
 *        name:
 *          type: string
 *          example: Titanic
 *        price:
 *          type: number
 *          example: 10
 *        quantity:
 *          type: integer
 *          minimum: 0
 *          example: 2
 *        description:
 *          type: string
 *          example: The Titanic movie
 *        movies:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Movie'
 *      required:
 *        - name
 *        - price
 *        - quantity
 */
const dvdShema = new mongoose.Schema({
  name: {type: String, required: true},
  price: {type: Number, required: true},
  quantity: {type: Number, required: true, min: 0},
  description: {type: String},
  movies: [{type: mongoose.Schema.Types.ObjectId, ref: "Movie"}]
});

mongoose.model('DVD', dvdShema, 'DVDs');