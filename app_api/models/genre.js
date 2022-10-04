var mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *  schemas:
 *    GenreMovies:
 *      description: ''
 *      type: object
 *      properties:
 *        movies:
 *          type: array
 *          uniqueItems: true
 *          minItems: 1
 *          items:
 *            required:
 *              - _id
 *              - imdb_id
 *              - title
 *              - year
 *              - description
 *            properties:
 *              _id:
 *                type: string
 *                minLength: 1
 *                example: 5fe645d9a70c0d3fd86e36b7
 *              imdb_id:
 *                type: string
 *                minLength: 1
 *                example: tt11656172
 *              title:
 *                type: string
 *                minLength: 1
 *                example: Hard Kill
 *              year:
 *                type: number
 *                example: 2020
 *              description:
 *                type: string
 *                minLength: 1
 *                example: Titanic is a 1997 American epic romance and disaster film directed by James Cameron.
 *        _id:
 *          type: string
 *          minLength: 1
 *          example: 5fe645d9a70c0d3fd86e36a8
 *        name:
 *          type: string
 *          minLength: 1
 *          example: Action
 *      required:
 *        - movies
 *        - _id
 *        - name
 *      title: GenreMovies
 */
const genreShema = new mongoose.Schema({
  name: {type: String, required: true},
  movies: [{type: mongoose.Schema.Types.ObjectId, ref: "Movie"}]
});

mongoose.model('Genre', genreShema, 'Genres');
