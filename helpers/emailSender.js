const Mailjet = require('node-mailjet');
const { MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE } = process.env;

const mailjet = new Mailjet({
  apiKey: MJ_APIKEY_PUBLIC,
  apiSecret: MJ_APIKEY_PRIVATE,
});

async function sendEmail(data) {
  const request = await mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'nneo2086@gmail.com',
        },
        To: [
          {
            Email: data.email,
          },
        ],
        Subject: data.subject,
        TextPart: data.text,
        HTMLPart: data.html,
      },
    ],
  });

  request
    .then(result => {
      console.log(result.body);
    })
    .catch(err => {
      console.log(err.statusCode);
    });
}

module.exports = {
  sendEmail,
};
