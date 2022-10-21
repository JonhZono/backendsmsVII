const nodemailer = require('nodemailer');

const processEmail = async ({ email, pin, type }) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  let result = '';
  switch (type) {
    case 'request-pin':
      result = await transporter.sendMail({
        from: '"Fred Foo 👻" <katrina87@ethereal.email>', // sender address
        to: email, //"bar@example.com, baz@example.com", list of receivers
        subject: 'Password Reset Pin', // Subject line
        text: 'Your password pin number is ' + pin, // plain text body
        html: '<b>Hello world?</b>', // html body
      });
      console.log('Message sent: %s', result.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(result));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      break;
    case 'update-password':
      result = await transporter.sendMail({
        from: '"Fred Foo 👻" <katrina87@ethereal.email>', // sender address
        to: email, //"bar@example.com, baz@example.com", list of receivers
        subject: 'Update Password', // Subject line
        text: 'Your password update successfully', // plain text body
        html: '<b>Hello world?</b>', // html body
      });
      console.log('Message sent: %s', result.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(result));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      break;
    case 'user-register':
      result = await transporter.sendMail({
        from: '"Fred Foo 👻" <katrina87@ethereal.email>', // sender address
        to: email, //"bar@example.com, baz@example.com", list of receivers
        subject: 'User Register Verification', // Subject line
        text: 'Welcome to GLI, here is your account detail', // plain text body
        html: '<b>User Register Verification</b>', // html body
      });
    case 'user-update':
      result = await transporter.sendMail({
        from: '"Fred Foo 👻" <katrina87@ethereal.email>', // sender address
        to: email, //"bar@example.com, baz@example.com", list of receivers
        subject: 'User Updated Successfully', // Subject line
        text: 'Welcome to GLI, here is your account detail', // plain text body
        html: '<b>User Updated Successfully</b>', // html body
      });
      console.log('Message sent: %s', result.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(result));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      break;
  }
};

module.exports = { processEmail };
