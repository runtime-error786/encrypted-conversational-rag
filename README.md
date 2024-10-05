# simple-node-app
A simple example node.js application to demonstrate my project structuring, coding patterns, and testing methodology.

## Getting Started

Prerequisites:
- Node.js installed natively on your computer ([download here](https://nodejs.org/)).
- Grab the repo and install node modules:

```shell
# clone the repo and install dependencies
$ git clone [git@github.com:joshuarwynn/simple-node-app.git](https://github.com/fahad-qureshi786/simple-node-app)
$ cd simple-node-app && npm install
```

```shell
# run the node app
$ npm start
```

- Begin hitting the [routes](#routes) with `curl` or your favorite API testing tool.

## Testing

To run the full integration test suite, execute the following:

```shell
# run all integration tests
$ npm test
```

To run the full integration test suite with code coverage, execute the following:

```shell
# run all integration tests and generate coverage report
$ npm run coverage
```

To run the linter on all code, execute the following:

```shell
# run linter on all code
$ npm run lint
```

## Routes

### GET `/trends/:place`

Grabs the latest trending data on Twitter for a given place.

#### URL Parameter

| URL Parameter | Required      | Description |
| ------------- | ------------- | ----------- |
| `place`      | True          | The place to search for trends |

#### Success Response

Sample Call: `curl localhost:3000/trends/denver`

Status Code: `200`

Response Body:
```
[
	{
		"trends": [
			{
				"name": "#Broncos",
				"url": "http://twitter.com/search?q=%23Broncos",
				"promoted_content": null,
				"query": "%23Broncos",
				"tweet_volume": null
			},
			{
				"name": "Trevor",
				"url": "http://twitter.com/search?q=Trevor",
				"promoted_content": null,
				"query": "Trevor",
				"tweet_volume": 18226
			},
			...
		],
		"as_of": "2017-10-22T23:49:56Z",
		"created_at": "2017-10-22T23:46:34Z",
		"locations": [
			{
				"name": "Denver",
				"woeid": 2391279
			}
		]
	}
]
```

#### Error Responses

Sample Call: `curl localhost:3000/trends/uranus`

Status Code: `404`

Response Body:
```
{
	"statusCode": 404,
	"error": "Not Found",
	"message": "uranus could not be found"
}
```

Sample Call: `curl localhost:3000/trends/newburgh%20indiana`

Status Code: `404`

Response Body:
```
{
	"statusCode": 404,
	"error": "Not Found",
	"message": "Trends for newburgh indiana could not be found"
}
```

Sample Call: `curl localhost:3000/trends/denver`

Status Code: `500`

Response Body:
```
{
	"statusCode": 500,
	"error": "Internal Server Error",
	"message": "An internal server error occurred"
}
```

### GET `/health`

A basic health check endpoint. Useful for system monitoring purposes.

#### Success Response

Sample Call: `curl localhost:3000/health`

Status Code: `200`

Response Body:
```
{
	"status": "healthy"
}
```
