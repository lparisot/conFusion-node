# A little REST server using a mongoDB

```bash
$ npm install
$ mongod --dbpath=data
$ npm start
```

Then you can get, create, delete: dishes, promotions and leaders on localhost:3000

## CRUD API

```bash
GET /dishes : get all dishes
POST /dishes : create a dish
DELETE /dishes : delete all dishes

GET /dishes/:id : get a particular dish
PUT /dishes/:id : update a particular dish
DELETE /dishes/:id : delete a particular dish

GET /dishes/:id : get a particular dish
PUT /dishes/:id : update a particular dish
DELETE /dishes/:id : delete a particular dish

GET /dishes/:id/comments : get all comments of a particular dish
POST /dishes/:id/comments : insert a comment of a particular dish
DELETE /dishes/:id/comments : delete all comments of a particular dish

GET /dishes/:id/comments/:id : get a particular comment of a particular dish
PUT /dishes/:id/comments/:id : update a particular comment of a particular dish
DELETE /dishes/:id/comments/:id : delete a particular comment of a particular dish
```

JSON format is used to populate database, see models.
