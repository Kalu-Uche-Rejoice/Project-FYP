//node mailer file
const mailer = require('nodemailer')
const postmark = require('postmark')
var http = require("http");

const client = new postmark.Client('4e4c74a4-8eed-466a-b469-c8e1875c1d6e');


{
    var transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'rejoicekaluuche@gmail.com',
          pass: 'arianzu02'
        }
    });
    var mailOptions = {
        from: 'rejoicekaluuche@gmail.com',
        to: 'kalu-uche.rejoice@stu.cu.edu.ng',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

exports. postmarkMail = ()=>{
  const client = new postmark.Client('4e4c74a4-8eed-466a-b469-c8e1875c1d6e');

  const email = {
  From: 'rejoicekaluuche@gmail.com',
  To: 'kalu-uche.rejoice@stu.cu.edu.ng',
  Subject: 'Test Email',
  TextBody: 'This is a test email sent from a Node.js application using Postmark.'
  };

  client.sendEmail(email, function(error, result) {
    if (error) {
    console.error('Error sending email:', error.message);
    } else {
    console.log('Email sent successfully!');
    console.log('Message ID:', result.MessageID);
    }
});

}

//PLAGIARISM CHECKER FUNCTION ATTEMPT.
exports.plagiarismChecker = async () => {
  const http = require('http');

  const options = {
    method: 'POST',
    hostname: 'pro.smallseotools.com',
    path: '/api/checkplag',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  const req = http.request(options, async function (res) {
    const chunks = [];

    res.on('data', function (chunk) {
      chunks.push(chunk);
    });

    res.on('end', function () {
      const body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });

  // Write the request body
  req.write(`
    Content-Disposition: form-data; name="token"
    ${YOUR_TOKEN}
    name="exclude_urls"
    ["EXCLUDE URL1","EXCLUDE URL2","EXCLUDE URL3"]
    name="url"
    ${PAGE_URL}
  `);

  // Send the request
  await req.end();
};
