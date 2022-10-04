const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const avtentikacija = jwt({
  secret: process.env.JWT_GESLO,
  algorithms: ['HS256']
});

const ctrlUsers = require('../controllers/users');
const ctrlGenre = require('../controllers/genre');
const ctrlDvd = require('../controllers/dvd');
const ctrlBill = require('../controllers/bill');
const ctrlSearch = require('../controllers/search');
const ctrlMovies = require('../controllers/movies');
const ctrlDB = require('../controllers/db');
const ctrlAvtentikacija = require('../controllers/avtentikacija');
//db
router.post('/delete', ctrlDB.deleteAll);
router.post('/create', ctrlDB.addAll);
//user
//  GET
/**
 * @swagger
 *  /users:
 *    get:
 *      summary: Get all users
 *      tags:
 *        - Users
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/User'
 *        '404':
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                description: ''
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    minLength: 1
 *                required:
 *                  - info
 *              examples:
 *                example-1:
 *                  value:
 *                    info: There is no user in database
 *        '500':
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                description: ''
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    minLength: 1
 *                required:
 *                  - info
 *              examples:
 *                example-1:
 *                  value:
 *                    info: Something went wrong!
 *      operationId: get-users
 *      description: Get all users.
 */
router.get('/users', ctrlUsers.getAll);

/**
 * @swagger
 *  '/users/id/{user_id}':
 *    parameters:
 *      - schema:
 *          type: string
 *        name: user_id
 *        in: path
 *        required: true
 *    get:
 *      summary: Get user by ID
 *      tags:
 *        - Users
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    $ref: '#/components/schemas/User'
 *        '404':
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                description: ''
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    minLength: 1
 *                required:
 *                  - info
 *              examples:
 *                example-1:
 *                  value:
 *                    info: There is no user with this id!
 *        '500':
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                description: ''
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    minLength: 1
 *                required:
 *                  - info
 *              examples:
 *                example-1:
 *                  value:
 *                    info: Something went wrong!
 *      operationId: get-user
 *      description: Get user by its ID
 */
router.get('/users/id/:user_id', ctrlUsers.getById);
//POST
/**
 * @swagger
 *  /users/create:
 *    post:
 *      summary: Add user
 *      tags:
 *        - Users
 *      responses:
 *        '201':
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    $ref: '#/components/schemas/User'
 *        '400':
 *          description: Bad Request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: Invalid body
 *        '401':
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                description: ''
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    minLength: 1
 *                    example: 'UnauthorizedError: No authorization token was found'
 *                required:
 *                  - info
 *        '500':
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: Something went wrong!
 *      operationId: add-user
 *      description: Add user
 *      security:
 *        - JWT: []
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserRegister'
 */
router.post('/users/create', avtentikacija, ctrlAvtentikacija.checkRole(["admin"], ctrlUsers.addUser));

/**
 * @swagger
 *  /users/login:
 *    post:
 *      summary: Login user
 *      tags:
 *        - Users
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmU2NDYzNjVkMDM2ZDRjMjA0YzY5NjMiLCJmaXJzdG5hbWUiOiJFbGVuYSIsImxhc3RuYW1lIjoiTWl5YWxrb3Zza2EgIiwiZW1haWwiOiJlbGVuYUBlbGVuYS5jb20iLCJyb2xlIjoidXNlciIsImV4cCI6MTYwOTYyMTE1OCwiaWF0IjoxNjA5MDE2MzU4fQ.BjV94Hu5Y8KgtE4n59MelwjFVK86cKiay6E2n-Hmyfo
 *                    description: JWT token
 *        '401':
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: object
 *                    properties:
 *                      info:
 *                        type: string
 *                        example: Napačno geslo
 *        '500':
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: Something went wrong!
 *      operationId: login-user
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserLogin'
 *      description: Login user
 */
router.post('/users/login', ctrlAvtentikacija.loginUser);

/**
 * @swagger
 *  /users/changePassword:
 *    post:
 *      summary: Change password
 *      tags:
 *        - Users
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  token:
 *                    type: string
 *                    example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmU2NDYzNjVkMDM2ZDRjMjA0YzY5NjMiLCJmaXJzdG5hbWUiOiJFbGVuYSIsImxhc3RuYW1lIjoiTWl5YWxrb3Zza2EgIiwiZW1haWwiOiJlbGVuYUBlbGVuYS5jb20iLCJyb2xlIjoidXNlciIsImV4cCI6MTYwOTYyMTc0MiwiaWF0IjoxNjA5MDE2OTQyfQ.1KBRoF227e671IDCGMx0JUYlJwUlVuIneEpUGGWZCu8
 *        '400':
 *          description: Bad Request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: Zahtevani so vsi podatki
 *        '500':
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: Something went wrong!
 *      operationId: change-password
 *      description: Change password
 *      security:
 *        - JWT: []
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserLogin'
 */
router.post('/users/changePassword', avtentikacija, ctrlAvtentikacija.checkRole(["user"],  ctrlAvtentikacija.changePassword));

/**
 * @swagger
 *  /users/register:
 *    post:
 *      summary: Register user
 *      tags:
 *        - Users
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *              examples:
 *                example-1:
 *                  value:
 *                    info: Success
 *        '400':
 *          description: Bad Request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: User with this email already exists!
 *        '500':
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: Something went wrong!
 *      operationId: register-user
 *      description: Register user
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserRegister'
 */
router.post('/users/register', ctrlAvtentikacija.register);
// movies
//  GET
/**
 * @swagger
 *  /movies:
 *    get:
 *      summary: List all movies
 *      tags:
 *        - Movies
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Movie'
 *                  count:
 *                    type: integer
 *                    example: 28
 *        '500':
 *          description: Internal Server Error
 *      operationId: list-movies
 *      description: List all movies
 *    parameters: []
 */
router.get('/movies', ctrlMovies.getAll);

/**
 * @swagger
 *  '/movies/id/{movie_id}':
 *    parameters:
 *      - schema:
 *          type: string
 *        name: movie_id
 *        in: path
 *        required: true
 *    get:
 *      summary: Get movie
 *      tags:
 *        - Movies
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    $ref: '#/components/schemas/Movie'
 *        '404':
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *              examples:
 *                example-1:
 *                  value:
 *                    info: There is no movie with this id!
 *        '500':
 *          description: Internal Server Error
 *      operationId: get-movie
 *      description: Get movie by its ID.
 */
router.get('/movies/id/:movie_id', ctrlMovies.getById);

/**
 * @swagger
 *  '/movies/id/{movie_id}/genre':
 *    parameters:
 *      - schema:
 *          type: string
 *        name: movie_id
 *        in: path
 *        required: true
 *    get:
 *      summary: Get genre of the movie
 *      tags:
 *        - Movies
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    $ref: '#/components/schemas/Genre'
 *        '404':
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *              examples:
 *                example-1:
 *                  value:
 *                    info: There is no movie with this id!
 *        '500':
 *          description: Internal Server Error
 *      operationId: get-movie-genre
 *      description: Return genre of the movie
 */
router.get('/movies/id/:movie_id/genre', ctrlMovies.getMovieGenre);

/**
 * @swagger
 *  /movies/autocomplete:
 *    get:
 *      summary: Return movie data based on its IMDB ID or title
 *      tags:
 *        - Movies
 *      responses:
 *        '201':
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    $ref: '#/components/schemas/Movie'
 *        '404':
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *              examples:
 *                example-1:
 *                  value:
 *                    info: There is no movie with this id!
 *        '500':
 *          description: Internal Server Error
 *      operationId: get-movie-autocomplete
 *      description: Return movie details given its IMDB ID or title
 *      parameters:
 *        - schema:
 *            type: string
 *          in: query
 *          name: i
 *          description: IMDB ID of the movie
 *        - schema:
 *            type: string
 *          in: query
 *          name: t
 *          description: Title of the movie
 */
router.get('/movies/autocomplete', ctrlMovies.getMovieDetails);

/**
 * @swagger
 *  /movies:
 *    post:
 *      summary: Create movie
 *      operationId: create-movie
 *      responses:
 *        '201':
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    $ref: '#/components/schemas/Movie'
 *        '400':
 *          description: Bad Request
 *          content:
 *            application/json:
 *              schema:
 *                description: ''
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    minLength: 1
 *                required:
 *                  - info
 *              examples:
 *                example-1:
 *                  value:
 *                    info: Request body is invalid!
 *        '404':
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                description: ''
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    minLength: 1
 *                required:
 *                  - info
 *              examples:
 *                example-1:
 *                  value:
 *                    info: There is no movie with this id!
 *        '500':
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                description: ''
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    minLength: 1
 *                required:
 *                  - info
 *              examples:
 *                example-1:
 *                  value:
 *                    info: Something went wrong!
 *      description: Create movie data.
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/MovieCreate'
 *      tags:
 *        - Movies
 *      security:
 *        - JWT: []
 */
// POST
router.post('/movies', avtentikacija, ctrlAvtentikacija.checkRole(["admin"], ctrlMovies.add));

/**
 * @swagger
 *  '/movies/id/{movie_id}':
 *    parameters:
 *      - schema:
 *          type: string
 *        name: movie_id
 *        in: path
 *        required: true
 *    delete:
 *      summary: Delete movie
 *      tags:
 *        - Movies
 *      responses:
 *        '204':
 *          description: No Content
 *        '401':
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                description: ''
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    minLength: 1
 *                    example: 'UnauthorizedError: No authorization token was found'
 *                required:
 *                  - info
 *        '404':
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                description: ''
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    minLength: 1
 *                    example: Movie with this id not found!
 *                required:
 *                  - info
 *        '500':
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                description: ''
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    minLength: 1
 *                    example: Cannot delete because some DVDs still contain this movie.
 *                required:
 *                  - info
 *      operationId: delete-movie
 *      description: Delete movie by its ID.
 *      security:
 *        - JWT: []
 *
 */
router.delete('/movies/id/:movie_id', avtentikacija, ctrlAvtentikacija.checkRole(["admin"], ctrlMovies.remove));

/**
 * @swagger
 *  /search:
 *    get:
 *      summary: Search movies by title or/and genre
 *      tags:
 *        - Movies
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Movie'
 *        '400':
 *          description: Bad Request
 *          content:
 *            application/json:
 *              schema:
 *                description: ''
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    minLength: 1
 *                required:
 *                  - info
 *              examples:
 *                example-1:
 *                  value:
 *                    info: "Please enter valid parameters: q=<naslov>&g=<zanr>"
 *        '404':
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                description: ''
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    minLength: 1
 *                required:
 *                  - info
 *              examples:
 *                example-1:
 *                  value:
 *                    info: Movie not found!
 *        '500':
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                description: ''
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    minLength: 1
 *                required:
 *                  - info
 *              examples:
 *                example-1:
 *                  value:
 *                    info: Something went wrong!
 *      operationId: search-movies
 *      description: Search movies by title or/and genre.
 *      parameters:
 *        - schema:
 *            type: string
 *          in: query
 *          name: q
 *          description: Movie's title
 *        - schema:
 *            type: string
 *          in: query
 *          name: g
 *          description: Movie's genre
 */
router.get('/search', ctrlSearch.searchMovies);

// PUT
/**
 * @swagger
 *  '/movies/id/{movie_id}':
 *    parameters:
 *      - schema:
 *          type: string
 *        name: movie_id
 *        in: path
 *        required: true
 *    put:
 *      summary: Update movie
 *      operationId: update-movie
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Movie'
 *        '400':
 *          description: Bad Request
 *          content:
 *            application/json:
 *              schema:
 *                description: ''
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    minLength: 1
 *                required:
 *                  - info
 *              examples:
 *                example-1:
 *                  value:
 *                    info: Request body is invalid!
 *        '401':
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                description: ''
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    minLength: 1
 *                    example: 'UnauthorizedError: No authorization token was found'
 *                required:
 *                  - info
 *        '404':
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                description: ''
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    minLength: 1
 *                required:
 *                  - info
 *              examples:
 *                example-1:
 *                  value:
 *                    info: There is no movie with this id!
 *        '500':
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                description: ''
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    minLength: 1
 *                required:
 *                  - info
 *              examples:
 *                example-1:
 *                  value:
 *                    info: Something went wrong!
 *      tags:
 *        - Movies
 *      description: Update movie by its ID.
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/MovieCreate'
 *        description: MovieCreate body
 *      security:
 *        - JWT: []
 * components:
 *  schemas:
 *    MovieCreate:
 *      description: 'Movie Update object'
 *      type: object
 *      properties:
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
 *          type: string
 *          example: 5fe645d9a70c0d3fd86e36aa
 *        description:
 *          type: string
 *          minLength: 1
 *          example: 'With his carefree lifestyle on the line, a wealthy charmer poses as a ranch hand to get a hardworking farmer to sell her family''s land before Christmas.'
 *      required:
 *        - imdb_id
 *        - title
 *        - year
 *        - genre
 *        - description
 *      title: MovieCreate
 */
router.put('/movies/id/:movie_id', avtentikacija, ctrlAvtentikacija.checkRole(["admin"], ctrlMovies.update));
// genre
//  GET
/**
 * @swagger
 *  /genres:
 *    get:
 *      summary: 'Get all genres '
 *      tags:
 *        - Genres
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                description: ''
 *                type: object
 *                properties:
 *                  info:
 *                    type: array
 *                    uniqueItems: true
 *                    minItems: 1
 *                    items:
 *                      $ref: '#/components/schemas/GenreMovies'
 *                  count:
 *                    type: number
 *                required:
 *                  - info
 *                  - count
 *              examples: {}
 *        '404':
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                description: ''
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    minLength: 1
 *                required:
 *                  - info
 *              examples:
 *                example-1:
 *                  value:
 *                    info: There is no genre in database
 *        '500':
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                description: ''
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    minLength: 1
 *                required:
 *                  - info
 *              examples:
 *                example-1:
 *                  value:
 *                    info: Something went wrong!
 *      operationId: get-genres
 *      description: Get all genres and their movies.
 */
router.get('/genres', ctrlGenre.getAll);

/**
 * @swagger
 *  '/genres/id/{genre_id}':
 *    parameters:
 *      - schema:
 *          type: string
 *        name: genre_id
 *        in: path
 *        required: true
 *    get:
 *      summary: Get genre by ID
 *      tags:
 *        - Genres
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    $ref: '#/components/schemas/GenreMovies'
 *        '404':
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                description: ''
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    minLength: 1
 *                required:
 *                  - info
 *              examples:
 *                example-1:
 *                  value:
 *                    info: There is no genre with this id!
 *        '500':
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                description: ''
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    minLength: 1
 *                required:
 *                  - info
 *              examples:
 *                example-1:
 *                  value:
 *                    info: Something went wrong!
 *      operationId: get-genre
 *      description: Get genre by ID
 */
router.get('/genres/id/:genre_id', ctrlGenre.getById);

/**
 * @swagger
 *  '/genres/id/{genre_id}/movies':
 *    parameters:
 *      - schema:
 *          type: string
 *        name: genre_id
 *        in: path
 *        required: true
 *    get:
 *      summary: Get all movies for specified genre
 *      tags:
 *        - Genres
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                description: ''
 *                type: object
 *                properties:
 *                  info:
 *                    type: array
 *                    uniqueItems: true
 *                    minItems: 1
 *                    items:
 *                      required:
 *                        - _id
 *                        - imdb_id
 *                        - title
 *                        - year
 *                        - description
 *                      properties:
 *                        _id:
 *                          type: string
 *                          minLength: 1
 *                        imdb_id:
 *                          type: string
 *                          minLength: 1
 *                        title:
 *                          type: string
 *                          minLength: 1
 *                        year:
 *                          type: number
 *                        description:
 *                          type: string
 *                          minLength: 1
 *                required:
 *                  - info
 *        '404':
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                description: ''
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    minLength: 1
 *                required:
 *                  - info
 *              examples:
 *                example-1:
 *                  value:
 *                    info: There is no genre with this id!
 *        '500':
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                description: ''
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    minLength: 1
 *                required:
 *                  - info
 *              examples:
 *                example-1:
 *                  value:
 *                    info: Something went wrong!
 *      operationId: get-genres-movies
 *      description: Get all movies for specified genre
 */
router.get('/genres/id/:genre_id/movies', ctrlGenre.getGenreMovies);
// dvd
//  GET
/**
 * @swagger
 *  /DVDs:
 *    get:
 *      summary: Get all DVDs
 *      tags:
 *        - DVDs
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/DVD'
 *        '404':
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: There is no DVD in database
 *        '500':
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: Something went wrong!
 *      operationId: get-DVDs
 *      description: Get all DVDs
 */
router.get('/DVDs', ctrlDvd.getAll);

/**
 * @swagger
 *  '/DVDs/id/{dvd_id}':
 *    parameters:
 *      - schema:
 *          type: string
 *        name: dvd_id
 *        in: path
 *        required: true
 *    get:
 *      summary: Get DVD by ID
 *      tags:
 *        - DVDs
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    $ref: '#/components/schemas/DVD'
 *        '404':
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: There is no DVD with this id!
 *        '500':
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: Something went wrong
 *      operationId: get-dvd
 *      description: Get DVD by ID
 */
router.get('/DVDs/id/:dvd_id', ctrlDvd.getById);

/**
 * @swagger
 *  '/DVDs/id/{dvd_id}/movies':
 *    parameters:
 *      - schema:
 *          type: string
 *        name: dvd_id
 *        in: path
 *        required: true
 *    get:
 *      summary: Get movies of the DVD
 *      tags:
 *        - DVDs
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Movie'
 *        '404':
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: There is no DVD with this id!
 *        '500':
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: Something went wrong!
 *      operationId: get-dvd-movies
 *      description: Get movies of the DVD
 */
router.get('/DVDs/id/:dvd_id/movies', ctrlDvd.getDVDMovies);

/**
 * @swagger
 *  /DVDs/qty:
 *    put:
 *      summary: Update DVD quantity
 *      tags:
 *        - DVDs
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    $ref: '#/components/schemas/DVD'
 *        '404':
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: There is no DVD with tihis id!
 *        '500':
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: Something went wrong!
 *      operationId: update-dvd-quantity
 *      description: Update DVD quantity
 *      parameters:
 *        - schema:
 *            type: string
 *          in: query
 *          name: dvd_id
 *          description: DVD identification
 *          required: true
 *        - schema:
 *            type: string
 *          in: query
 *          name: quantity
 *          description: DVD quantity
 */
router.get('/DVDs/qty', ctrlDvd.updateQuantity);
//  POST
/**
 * @swagger
 *  '/DVDs':
 *    post:
 *      summary: Create DVD
 *      operationId: create-dvd
 *      responses:
 *        '201':
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    $ref: '#/components/schemas/DVD'
 *        '400':
 *          description: Bad Request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: There is already a DVD with this name!
 *        '401':
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: User not authorized!
 *        '500':
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: Something went wrong!
 *      tags:
 *        - DVDs
 *      description: Create DVD
 *      security:
 *        - JWT: []
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/DVD'
 */
router.post('/DVDs', avtentikacija, ctrlAvtentikacija.checkRole(["admin"], ctrlDvd.add));
//  PUT
/**
 * @swagger
 *  '/DVDs/id/{dvd_id}':
 *    parameters:
 *      - schema:
 *          type: string
 *        name: dvd_id
 *        in: path
 *        required: true
 *    put:
 *      summary: Update DVD
 *      operationId: update-dvd
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    $ref: '#/components/schemas/DVD'
 *        '401':
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: User not authorized!
 *        '404':
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: There is no DVD with this id!
 *        '500':
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: Something went wrong!
 *      tags:
 *        - DVDs
 *      description: Update DVD
 *      security:
 *        - JWT: []
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/DVD'
 */
router.put('/DVDs/id/:dvd_id', avtentikacija, ctrlAvtentikacija.checkRole(["admin"], ctrlDvd.update));
//  DELETE
/**
 * @swagger
 *  '/DVDs/id/{dvd_id}':
 *    parameters:
 *      - schema:
 *          type: string
 *        name: dvd_id
 *        in: path
 *        required: true
 *    delete:
 *      summary: 'Delete DVD by its ID'
 *      tags:
 *        - DVDs
 *      operationId: delete-dvd
 *      responses:
 *        '204':
 *          description: No Content
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: Success
 *        '404':
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: There is no DVD with this id!
 *        '500':
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: Something went wrong!
 *      description: Delete DVD
 *      security:
 *        - JWT: []
 */
router.delete('/DVDs/id/:dvd_id', avtentikacija, ctrlAvtentikacija.checkRole(["admin"], ctrlDvd.remove));

// bills
//  GET
/**
 * @swagger
 *  /bills:
 *    get:
 *      summary: Get all bills
 *      tags:
 *        - Bills
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Bill'
 *        '401':
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: Unauthorized!
 *        '404':
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: There is no bill in database!
 *        '500':
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: Something went wrong!
 *      operationId: get-bills
 *      description: Get all bills
 *      security:
 *        - JWT: []
 */
router.get('/bills', avtentikacija, ctrlAvtentikacija.checkRole(["admin"], ctrlBill.getAll));

/**
 * @swagger
 *  '/bills/user/{user_id}':
 *    parameters:
 *      - schema:
 *          type: string
 *        name: user_id
 *        in: path
 *        required: true
 *    get:
 *      summary: Get all user's bills
 *      tags:
 *        - Bills
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Bill'
 *        '401':
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: Unauthorized!
 *        '404':
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: There is no bill with this id!
 *        '500':
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: Something went wrong!
 *      operationId: get-user-bills
 *      description: Get user's bills
 *      security:
 *        - JWT: []
 */
router.get('/bills/user/:user_id', avtentikacija, ctrlAvtentikacija.checkRole(["user"], ctrlBill.getByUserId));

/**
 * @swagger
 *  '/bills/id/{bill_id}':
 *    parameters:
 *      - schema:
 *          type: string
 *        name: bill_id
 *        in: path
 *        required: true
 *    get:
 *      summary: Get bill by ID
 *      tags:
 *        - Bills
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    $ref: '#/components/schemas/Bill'
 *        '401':
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: Unauthorized!
 *        '404':
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: Bill with this id not found!
 *        '500':
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: Something went wrong!
 *      operationId: get-bill
 *      description: Get bill by ID
 *      security:
 *        - JWT: []
 */
router.get('/bills/id/:bill_id', avtentikacija, ctrlAvtentikacija.checkRole(["user"], ctrlBill.getById));

/**
 * @swagger
 *  '/bills/id/{bill_id}/user':
 *    parameters:
 *      - schema:
 *          type: string
 *        name: bill_id
 *        in: path
 *        required: true
 *    get:
 *      summary: Get user of the bill
 *      tags:
 *        - Bills
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    $ref: '#/components/schemas/User'
 *        '401':
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: Unauthorized
 *        '404':
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: There is no bill with this id!
 *        '500':
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: Something went wrong
 *      operationId: get-user-of-bill
 *      description: Get user of the specific bill
 *      security:
 *        - JWT: []
 */
router.get('/bills/id/:bill_id/user', avtentikacija, ctrlAvtentikacija.checkRole(["user"], ctrlBill.getUser));

/**
 * @swagger
 *  '/bills/id/{bill_id}/pdf':
 *    parameters:
 *      - schema:
 *          type: string
 *        name: bill_id
 *        in: path
 *        required: true
 *    post:
 *      summary: Retrieve bill in PDF format
 *      tags:
 *        - Bills
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/pdf:
 *              schema:
 *                type: string
 *                format: binary
 *                example: PDF file in binary format
 *        '401':
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: Unauthorized!
 *        '404':
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: There is no bill with this id!
 *        '500':
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: Something went wrong!
 *      operationId: get-bill-pdf
 *      description: Retrieve bill in PDF format
 *      security:
 *        - JWT: []
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                location:
 *                  type: string
 *                  example: bill_report.pdf
 *                  description: Name of the bill report received!
 */
router.post('/bills/id/:bill_id/pdf', avtentikacija, ctrlAvtentikacija.checkRole(["user"], ctrlBill.getBillPdf));

/**
 * @swagger
 *  /bills:
 *    post:
 *      summary: Create bill
 *      operationId: create-bill
 *      responses:
 *        '201':
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    $ref: '#/components/schemas/Bill'
 *        '400':
 *          description: Bad Request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: Invalid request body!
 *        '401':
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: Unauthorized!
 *        '404':
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: There is no user with this id
 *        '500':
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  info:
 *                    type: string
 *                    example: Something went wrong!
 *      tags:
 *        - Bills
 *      description: Crate bill
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                user:
 *                  type: string
 *                  description: User id
 *                  example: 5fe646365d036d4c204c6963
 *                total:
 *                  type: number
 *                  description: Total amount payed
 *                  example: 10
 *                dvd:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/DVD'
 *              required:
 *                - user
 *                - total
 *      security:
 *        - JWT: []
 */
router.post('/bills', avtentikacija, ctrlAvtentikacija.checkRole(["user"], ctrlBill.add));

module.exports = router;
