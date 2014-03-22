API END POINTS
--------------

#### Sign up a user

`POST /signup`

Form needed:

    username: phone's id

Example response:

    {
        "response": "OK",
        "user": {
            "__v": 0,
            "username": "xyz3",
            "_id": "532d2b7106c843159920de87",
            "created_at": "2014-03-22T06:19:29.956Z"
        }
    }

Or in case of an error:

    {
        "response": "FAIL",
        "errors": [
            "User already exists"
        ]
    }

#### Login the user

`POST /signing`

Form needed:

    username: phone's id

Example response:

    {
        "response": "OK",
        "user": {
            "__v": 0,
            "username": "xyz3",
            "_id": "532d2b7106c843159920de87",
            "created_at": "2014-03-22T06:19:29.956Z"
        }
    }

