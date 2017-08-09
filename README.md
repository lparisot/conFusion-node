# A little REST server using a mongoDB

```bash
$ npm install
$ mongod --dbpath=data
$ npm start
```
The server is up on localhost:3000

## Simple user API

You can register new users, login or logout

```bash
GET /users : return all users if you are log in as an admin

POST /register : create a new user
in the body:
{
	"username": "admin",
	"password": "admin",
	"firstname": "firstname",
	"lastname": "lastname"
}

POST /users/login : log in operation
in the body:
{
	"username": "admin",
	"password": "admin"
}

GET /users/logout : log out operation
```
You can change a created user role only by using directly mongoDB shell:
```bash
$ mongo
> use conFusion
> db.users.find().pretty()
> db.users.update({username: "admin"}, {$set:{admin:true}})
```
Then you can do get, create, delete operations, using the token returned by the login operation, providing it in header fields as x-access-token.

## CRUD API

GET operations are authorized to all users, PUT,POST,DELETE operations only for admin user.  
Operations can be done on /dishes, /promotions or /leadership.

```bash
GET /dishes : get all dishes
POST /dishes : create a dish
in the body:
{
  "name": "Uthapizza",
  "image": "images/uthapizza.png",
  "category": "mains",
  "label": "Hot",
  "price": "4.99",
  "description": "A unique combination of Indian Uthappam (pancake) and Italian pizza, topped with Cerignola olives, ripe vine cherry tomatoes, Vidalia onion, Guntur chillies and Buffalo Paneer."
}
DELETE /dishes : delete all dishes

GET /dishes/:id : get a particular dish
PUT /dishes/:id : update a particular dish
DELETE /dishes/:id : delete a particular dish

GET /dishes/:id/comments : get all comments on a particular dish
POST /dishes/:id/comments : insert a comment on a particular dish
in the body:
{
	"rating": 5,
	"comment": "Imagine all the eatables, living in conFusion!"
}
DELETE /dishes/:id/comments : delete all comments on a particular dish

GET /dishes/:id/comments/:id : get a particular comment on a particular dish
PUT /dishes/:id/comments/:id : update a particular comment on a particular dish
DELETE /dishes/:id/comments/:id : delete a particular comment on a particular dish
```

JSON format is used to populate database, see models.
