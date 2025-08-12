const EMAIL_VERIFICATION_TEMPLATE = `
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Your OTP Code</title>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Fuzzy+Bubbles:wght@400;700&family=Lunasima:wght@400;700&family=M+PLUS+Rounded+1c&display=swap");

      body {
        font-family: "Lunasima", sans-serif;
        background-color: #f4f3f0;
        margin: 0;
        padding: 0;
      }
      .container {
        /* background-color: #ffffff; */
        max-width: 600px;
        margin: 40px auto;
        padding: 40px 30px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        text-align: center;
      }
      .logo {
        margin-bottom: 25px;
        width: 160px;
        height: 160px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fceceb;
        margin-left: auto;
        margin-right: auto;
      }
      .logo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }
      .otp-code {
        font-size: 36px;
        font-weight: 600;
        color: #e53935;
        margin: 30px 0;
        letter-spacing: 6px;
      }
      p {
        font-size: 14px;
        color: #333333;
        line-height: 1.5;
        margin: 10px 0;
      }
      h2 {
        color: #2c2c2c;
        margin-bottom: 10px;
      }
      .footer {
        font-size: 12px;
        color: #777;
        text-align: center;
        margin-top: 35px;
        border-top: 1px solid #eee;
        padding-top: 15px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Logo -->
      <div class="logo">
        <img
          src="https://res.cloudinary.com/dpji4qfnu/image/upload/v1751696528/connectly-logo_ethju7.png"
          alt="Company Logo"
        />
      </div>

      <!-- Email Content -->
      <h2>Hello {{username}},</h2>
      <p>Your One-Time Password (OTP) is:</p>

      <div class="otp-code">{{otp}}</div>

      <p>
        This code is valid for the next <strong>[{{otpValidity}} minutes]</strong> and can
        only be used once.
      </p>
      <p><strong>Please do not share this code</strong> with anyone.</p>

      <p>
        If you did not request this code, please contact our support team
        immediately.
      </p>

      <div class="footer">
        &copy; {{year}} Connectly. All rights reserved.<br />
        dmoradiya443@gmail.com | 1234567890
      </div>
    </div>
  </body>
</html>
`;

export { EMAIL_VERIFICATION_TEMPLATE };

("");
