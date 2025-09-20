const EMAIL_VERIFICATION_TEMPLATE = `
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your OTP Code</title>
    <style>
      /* Google Fonts */
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

      body {
        font-family: 'Inter', sans-serif;
        background-color: #f5f5f5;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        padding: 40px 30px;
        text-align: center;
      }

      .logo {
        margin-bottom: 30px;
      }

      .logo img {
        width: 120px;
        height: 120px;
        object-fit: contain;
      }

      h1 {
        font-size: 24px;
        font-weight: 700;
        color: #202124;
        margin-bottom: 10px;
      }

      p {
        font-size: 16px;
        color: #5f6368;
        line-height: 1.5;
        margin: 15px 0;
      }

      .otp-code {
        display: inline-block;
        font-size: 32px;
        font-weight: 700;
        color: #1a73e8;
        letter-spacing: 6px;
        padding: 15px 25px;
        border-radius: 8px;
        background-color: #e8f0fe;
        margin: 20px 0;
      }

      .button {
        display: inline-block;
        margin-top: 25px;
        padding: 12px 25px;
        background-color: #1a73e8;
        color: #ffffff;
        font-weight: 600;
        font-size: 16px;
        border-radius: 6px;
        text-decoration: none;
      }

      .footer {
        font-size: 12px;
        color: #9aa0a6;
        margin-top: 40px;
        line-height: 1.4;
      }

      @media only screen and (max-width: 600px) {
        .container {
          padding: 30px 20px;
        }
        .otp-code {
          font-size: 28px;
          padding: 12px 20px;
        }
        h1 {
          font-size: 22px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Logo -->
      <div class="logo">
        <img src="https://res.cloudinary.com/dpji4qfnu/image/upload/v1751696528/connectly-logo_ethju7.png" alt="Connectly Logo" />
      </div>

      <!-- Email Content -->
      <h1>Hello {{username}},</h1>
      <p>You requested to verify your email address. Use the OTP below to complete the process:</p>

      <div class="otp-code">{{otp}}</div>

      <p>This code is valid for the next <strong>{{otpValidity}} minutes</strong> and can only be used once.</p>
      <p><strong>Please do not share this code</strong> with anyone.</p>
      <p>If you did not request this, please ignore this email or contact support.</p>

      <!-- Optional button -->
      <!-- <a href="{{verificationLink}}" class="button">Verify Email</a> -->

      <div class="footer">
        &copy; {{year}} Connectly. All rights reserved.<br />
        dmoradiya443@gmail.com | 1234567890
      </div>
    </div>
  </body>
</html>
`;

export { EMAIL_VERIFICATION_TEMPLATE };
