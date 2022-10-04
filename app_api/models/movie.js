var mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *  schemas:
 *    Movie:
 *      description: ''
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *          minLength: 1
 *          example: 5fe645d9a70c0d3fd86e36cc
 *        imdb_id:
 *          type: string
 *          minLength: 1
 *          example: tt13055780
 *        title:
 *          type: string
 *          minLength: 1
 *          example: A California Christmas
 *        year:
 *          type: number
 *          example: 2020
 *        genre:
 *          $ref: '#/components/schemas/Genre'
 *        description:
 *          type: string
 *          minLength: 1
 *          example: 'With his carefree lifestyle on the line, a wealthy charmer poses as a ranch hand to get a hardworking farmer to sell her family''s land before Christmas.'
 *        __v:
 *          type: number
 *      required:
 *        - _id
 *        - imdb_id
 *        - title
 *        - year
 *        - genre
 *        - description
 *        - __v
 *      title: Movie
 *    Genre:
 *      description: ''
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *          minLength: 1
 *          example: 5fe645d9a70c0d3fd86e36ae
 *        name:
 *          type: string
 *          minLength: 1
 *          example: Romance
 *      required:
 *        - _id
 *        - name
 *      title: Genre
 *  securitySchemes:
 *    JWT:
 *      type: http
 *      scheme: bearer
 */
const movieSchema = new mongoose.Schema({
    imdb_id: {type: String, required: true},
    title: {type: String, required: true},
    year: {type: Number, required: true},
    genre: {type: mongoose.Schema.Types.ObjectId, ref: "Genre", required: true},
    description: {type: String, required: true}
});
movieSchema.index({name: "text", "title": "text"});
mongoose.model("Movie", movieSchema, "Movies");