# Ucentric API NodeJS Client

## Install

```
npm i @ucentric/ucentric-node-client
```

## Usage

After [creating an api key](https://help.ucentric.io/article/22-generating-api-keys), import the library and call the constructor.

```
const ucentric = new Ucentric({
  publicKey: process.env.UCENTRIC_PUBLIC_KEY,
  secretKey: process.env.UCENTRIC_SECRET_KEY,
});
```

Then you can call the api using the `ucentric` object. All methods will return a promise.

```
ucentric.getNudgesByReference('123').then(nudges => {
  console.log(nudges);
});
```

Optional constructor arguments include:

```
const ucentric = new Ucentric({
  accountId: "abcd-1234-efgh",
  baseUrl: "https://www.testserver.dev"
});

```

## Methods

### getNudgesByReference(referenceId)

Returns an array of Nudges that match a given reference ID. A maximum of the last 100 most recent Nudges are returned.

| Parameter  | Parameter Type |
| ------------- | ------------- |
| referenceId  | string  |

Example Response:

```
[
  {
    "userId": "test4",
    "type": "Card",
    ...
  }
]
```

### createNudge(nudge)

Creates a new Nudge. See the [API documentation](https://docs.ucentric.io/?javascript#create-a-nudge) on creating Nudges for more info.

Example Response:

```
{
  "id": "b10e563d-6a4f-49c7-aa26-b40d8daaff67_7dad989a-61cb-4f72-bf3c-72cb0ace82ea",
  "userId": "test",
  "reference": "message_10",
  "usage": 22
}
```

### createNudgeToken(userId, expire?)

Creates a signed token used to fetch Nudges. You must first enable [secure nudges](https://help.ucentric.io/article/42-secure-nudges) and pass an `accountId` parameter to the Ucentric constructor.

Unless a unix timestamp value is passed for the expire option, tokens will expire 60 seconds after they are created.

| Parameter  | Parameter Type |
| ------------- | ------------- |
| userId  | string  |
| exp?  | number/unix timestamp  |

Example Response:

```
{
  key: "my-public-key",
  token: "2629055688",
  exp: 1605797115
}
```


## Developing

```
git clone
npm install
npm run test
```
