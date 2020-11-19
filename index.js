const crypto = require('crypto');
const fetch = require("isomorphic-unfetch");

class Ucentric {
  constructor(config) {
    this.config = config;
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

  createNudgeToken(userId, expire) {
    if (!this.config.accountId) {
      throw new Error("accountId missing from config");
    }

    const exp = expire || Math.ceil(+new Date()/1000) + 60; // unix timestamp seconds default 60 seconds
    const str = this.config.accountId + userId + `?Expires=${exp}&Key=${this.config.publicKey}`
    const hmac = crypto.createHmac('sha256', this.config.secretKey);
    const token = hmac.update(str).digest("hex");
    return {
      key:  this.config.publicKey,
      token: token,
      exp: exp
    };
  }
}

module.exports = Ucentric;
