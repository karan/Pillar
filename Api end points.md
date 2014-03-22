API END POINTS
--------------

##### User data returned in each response

    {
        "response": "OK",
        "user": {
            "__v": 0,
            "_id": "532d703b5331699ae745db51",
            "username": "tu",
            "scores": [
                {
                    "score": 5,
                    "_id": "532d70425331699ae745db52",
                    "timestamp": "2014-03-22T11:14:40.710Z"
                },
                {
                    "score": 5,
                    "_id": "532d704a5331699ae745db53",
                    "timestamp": "2014-03-22T11:14:40.710Z"
                },
                {
                    "score": 10,
                    "_id": "532d70935e3e83f5e77b9e85",
                    "timestamp": "2014-03-22T11:14:27.218Z"
                }
            ],
            "created_at": "2014-03-22T11:12:59.250Z"
        }
    }

#### Sign up a user

`POST /signup`

Form needed:

    username: phone's id

In case of an error:

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

In case user not found:

    {
        "response": "FAIL",
        "errors": [
            "User not found"
        ]
    }

#### Add a score

`/addscore`

Form needed:

    score: the new score to add
