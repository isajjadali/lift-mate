import path from 'path';
import templateMaker from './template-maker';
import sendEmail from './twilio-mailer';

import { formatDate } from '../../lib/common.js';

const __dirname = path.resolve(
  process.cwd(),
  'server',
  'lib',
  'email-sender'
);

export default async function (templateName, mailOptions) {
  try {
    const tempMailOptions = JSON.parse(JSON.stringify(mailOptions));
    if (!tempMailOptions.variables) {
      tempMailOptions.variables = {};
    }

    // Default template variables
    tempMailOptions.variables.appConfig = {
      adminEmail: process.env.ADMIN_EMAIL,
      emailName: process.env.APP_NAME_SHORT,
      appLogoUrl: `${process.env.S3_AWS_URL}/logo.png`,
      liveAppUrl: process.env.LIVE_APP_URL,
      appNameSpaced: process.env.APP_NAME_SPACED,
      emailPhoneNumber: process.env.EMAIL_PHONE_NUMBER,
      emailPhoneNumberMasked: process.env.EMAIL_PHONE_NUMBER_MASKED,
      emailPhoneNumberFormatted:
        process.env.EMAIL_PHONE_NUMBER_FORMATTED,
      emailPhoneNumberFormattedMasked:
        process.env.EMAIL_PHONE_NUMBER_FORMATTED_MASKED,
    };

    if ((tempMailOptions.variables.reservation || {} || {}).pickUpDateTime) {
      // Shit Work
      tempMailOptions.variables.reservation.pickUpDateTime = formatDate(
        tempMailOptions.variables.reservation.pickUpDateTime
      );
    }

    let html = await templateMaker(
      path.resolve(path.join(__dirname, `../../views/${templateName}.ejs`)),
      tempMailOptions.variables || {}
    );
    await sendEmail({
      ...tempMailOptions,
      from: {
        email: process.env.EMAIL,
        name: process.env.APP_NAME_SHORT,
      },
      html,
    });

    if (tempMailOptions.variables.sentToAdmin) {
      html = await templateMaker(
        path.resolve(path.join(__dirname, `../../views/${templateName}.ejs`)),
        tempMailOptions.variables || {}
      );

      sendEmail({
        ...tempMailOptions,
        to: process.env.ADMIN_EMAIL,
        from: {
          email: process.env.EMAIL,
          name: process.env.APP_NAME_SHORT,
        },
        html,
      });
    }
    delete tempMailOptions.variables;
    console.info('Mail sent successfully!');
  } catch (e) {
    console.error(e);
  }
};
