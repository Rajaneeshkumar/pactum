const pactum = require('../../src/index');

describe('Remote- post single mock interaction', () => {

  before(async () => {
    const response = await pactum
      .post('http://localhost:9393/api/pactum/mockInteraction')
      .withJson({
        withRequest: {
          method: 'GET',
          path: '/api/projects/1'
        },
        willRespondWith: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          body: {
            id: 1,
            name: 'fake'
          }
        }
      })
      .expectStatus(200)
      .expectJsonLike({
        id: /\w+/
      })
      .toss();
    this.id = response.id;
  });

  it('get all mock interactions', async () => {
    await pactum
      .get('http://localhost:9393/api/pactum/mockInteraction')
      .expectStatus(200)
      .expectJson([{
        id: this.id,
        mock: true,
        port: 9393,
        rawInteraction: {
          willRespondWith: {
            body: {
              id: 1,
              name: 'fake'
            },
            headers: {
              'content-type': 'application/json'
            },
            status: 200
          },
          withRequest: {
            method: 'GET',
            path: '/api/projects/1'
          }
        },
        willRespondWith: {
          body: {
            id: 1,
            name: 'fake'
          },
          headers: {
            'content-type': 'application/json'
          },
          rawBody: {
            id: 1,
            name: 'fake'
          },
          status: 200
        },
        withRequest: {
          ignoreBody: false,
          ignoreQuery: false,
          method: 'GET',
          path: '/api/projects/1'
        }
      }])
      .toss();
  });

  it('get single mock interaction', async () => {
    await pactum
      .get(`http://localhost:9393/api/pactum/mockInteraction/${this.id}`)
      .expectStatus(200)
      .expectJson({
        id: this.id,
        mock: true,
        port: 9393,
        rawInteraction: {
          willRespondWith: {
            body: {
              id: 1,
              name: 'fake'
            },
            headers: {
              'content-type': 'application/json'
            },
            status: 200
          },
          withRequest: {
            method: 'GET',
            path: '/api/projects/1'
          }
        },
        willRespondWith: {
          body: {
            id: 1,
            name: 'fake'
          },
          headers: {
            'content-type': 'application/json'
          },
          rawBody: {
            id: 1,
            name: 'fake'
          },
          status: 200
        },
        withRequest: {
          ignoreBody: false,
          ignoreQuery: false,
          method: 'GET',
          path: '/api/projects/1'
        }
      })
      .toss();
  });

  after(async () => {
    await pactum
      .delete(`http://localhost:9393/api/pactum/mockInteraction/${this.id}`)
      .expectStatus(200)
      .toss();
  });

});

describe('Remote- post single pact interaction', () => {

  before(async () => {
    const response = await pactum
      .post('http://localhost:9393/api/pactum/pactInteraction')
      .withJson({
        consumer: 'little',
        provider: 'big',
        state: 'liquid',
        uponReceiving: 'vapour',
        withRequest: {
          method: 'GET',
          path: '/api/projects/1'
        },
        willRespondWith: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          body: {
            id: 1,
            name: 'fake'
          }
        }
      })
      .expectStatus(200)
      .expectJsonLike({
        id: /\w+/
      })
      .toss();
    this.id = response.id;
  });

  it('get all mock interactions', async () => {
    await pactum
      .get('http://localhost:9393/api/pactum/pactInteraction')
      .expectStatus(200)
      .expectJson([{
        id: this.id,
        consumer: 'little',
        provider: 'big',
        state: 'liquid',
        uponReceiving: 'vapour',
        mock: false,
        port: 9393,
        rawInteraction: {
          consumer: 'little',
          provider: 'big',
          state: 'liquid',
          uponReceiving: 'vapour',
          willRespondWith: {
            body: {
              id: 1,
              name: 'fake'
            },
            headers: {
              'content-type': 'application/json'
            },
            status: 200
          },
          withRequest: {
            method: 'GET',
            path: '/api/projects/1'
          }
        },
        willRespondWith: {
          body: {
            id: 1,
            name: 'fake'
          },
          headers: {
            'content-type': 'application/json'
          },
          rawBody: {
            id: 1,
            name: 'fake'
          },
          status: 200
        },
        withRequest: {
          ignoreBody: false,
          ignoreQuery: false,
          method: 'GET',
          path: '/api/projects/1'
        }
      }])
      .toss();
  });

  it('get single mock interaction', async () => {
    await pactum
      .get(`http://localhost:9393/api/pactum/pactInteraction/${this.id}`)
      .expectStatus(200)
      .expectJson({
        id: this.id,
        consumer: 'little',
        provider: 'big',
        state: 'liquid',
        uponReceiving: 'vapour',
        mock: false,
        port: 9393,
        rawInteraction: {
          consumer: 'little',
          provider: 'big',
          state: 'liquid',
          uponReceiving: 'vapour',
          willRespondWith: {
            body: {
              id: 1,
              name: 'fake'
            },
            headers: {
              'content-type': 'application/json'
            },
            status: 200
          },
          withRequest: {
            method: 'GET',
            path: '/api/projects/1'
          }
        },
        willRespondWith: {
          body: {
            id: 1,
            name: 'fake'
          },
          headers: {
            'content-type': 'application/json'
          },
          rawBody: {
            id: 1,
            name: 'fake'
          },
          status: 200
        },
        withRequest: {
          ignoreBody: false,
          ignoreQuery: false,
          method: 'GET',
          path: '/api/projects/1'
        }
      })
      .toss();
  });

  after(async () => {
    await pactum
      .delete(`http://localhost:9393/api/pactum/pactInteraction/${this.id}`)
      .expectStatus(404)
      .toss();
  });

});