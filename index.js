const fetch = require("isomorphic-unfetch");

class Ucentric {
  constructor(config) {
    this.basePath = config.basePath || 'https://api.ucentric.io';
    this.auth = 'Basic ' + Buffer.from(config.publicKey + ':' + config.secretKey).toString('base64');
  }

  request(endpoint = "", options = {}) {
    return new Promise((resolve, reject) => {
      let url = this.basePath + endpoint;

      let headers = {
        'Content-Type': 'application/json',
        'Authorization': this.auth
      }

      let config = {
        ...options,
        headers
      }

      fetch(url, config).then(r => {
        r.json().then(res => {
          if (r.ok) {
            resolve(res)
          } else {
            reject(res)
          }
        }).catch(err => {
          reject({
            Status: 500,
            Msg: "Unknown Error",
            Code: "CLIENT"
          });
        });
      })
    });
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
