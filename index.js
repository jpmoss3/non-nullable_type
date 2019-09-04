const { exec } = require('child_process');
const { GraphQLClient } = require('graphql-request');


const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InNlcnZpY2UiOiJsaW5rZWRMaXN0QGRldiIsInJvbGVzIjpbImFkbWluIl19LCJpYXQiOjE1Njc1MTYwMjEsImV4cCI6MTU2ODEyMDgyMX0.W4E3ak5TptK9u1K4UwrACoCELGDhOovTjo-8uc9olv0"

const client = new GraphQLClient(
  'http://localhost:4466/non-nullable/dev',
  { headers: { Authorization: `Bearer ${token}` } }
);

async function sendRequest(req) {
  let result = {};
  try {
    result = await client.request(req);
    // console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    console.log(req, JSON.stringify(e, null, 2));
  }
  return result;
}

const createBar = (name) => `mutation {
  createBar(data: {
    name:"bar.${name}"
    foo: {create: {name:"foo.${name}"}}
  })
  { id name }
}`;

const queryBars = () => `query {
  bars {id name foo {id name}}
}`;

const deleteBar = (id) => `mutation {deleteBar(where: {id: "${id}"}) {id name}}`;

async function main() {
  for (let i = 0; i < 10; i++) {
    await sendRequest(createBar(`${i}`));
  }
  let resp = await sendRequest(queryBars());

  let promises = [];
  for (const bar of resp.bars) {
    promises.push(sendRequest(deleteBar(bar.id)));
  }

  do {
    resp = await sendRequest(queryBars());
  } while (resp && resp.bars && resp.bars.length);

  return Promise.all(promises);
}

main()
  .then((results) => console.log('done'))
  .catch((e) => console.log(e));
