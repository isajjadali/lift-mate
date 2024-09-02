import path from 'path';
import templateMaker from './template-maker';
import sendEmail from './twilio-mailer';

import { formatDate } from '../../lib/common.js';

export default async function (templateName, mailOptions) {
  try {
    const tempMailOptions = JSON.parse(JSON.stringify(mailOptions));
    if (!tempMailOptions.variables) {
      tempMailOptions.variables = {};
    }

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
        name: process.env.EMAIL_NAME || '95 Star',
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
        to: 'reservation@LiftMate.com',
        from: {
          email: process.env.EMAIL,
          name: process.env.EMAIL_NAME || '95 Star',
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
