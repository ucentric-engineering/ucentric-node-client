const fetch = require("isomorphic-unfetch");

class Ucentric {
  constructor(config) {
    this.basePath = config.basePath || 'https://api.ucentric.io';
    this.auth = 'Basic ' + Buffer.from(config.publicKey + ':' + config.secretKey).toString('base64');
  }

  request(endpoint = "", options = {}) {
    let url = this.basePath + endpoint;

    let headers = {
      'Authorization': this.auth,
      'Content-type': 'application/json'
    }

    let config = {
      ...options,
      ...headers
    }

    return fetch(url, config).then(r => {
      if (r.ok) {
        return r.json()
      }
      throw new Error(r)
    })
  }

  getNudgesByReference(referenceId) {
    let url = "/app/api/v1/nudges?reference=" + referenceId;
    let config = {
      method: 'GET'
    }
    return this.request(url, config)
  }

  createNudge(nudge) {
    const options = {
      method: 'POST',
      body: JSON.stringify(nudge)
    }
    return this.request('/app/api/v1/nudges', options)
  }
}

module.exports = Ucentric;
