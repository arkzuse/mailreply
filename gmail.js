import {google} from 'googleapis';

async function getMails(oAuth2Client) {
    const gmail = google.gmail({version: 'v1', auth: oAuth2Client});
    const res = await gmail.users.messages.list({
        userId: 'me',
        q: 'is:unread in:inbox'
    });

    return res.data.messages || [];
}

// reply to message
async function replyMail(oAuth2Client, message, replyText) {
    const gmail = google.gmail({version: 'v1', auth: oAuth2Client});

    const res = await gmail.users.messages.get({
        userId: 'me',
        id: message.id,
    });

    const headers = res.data.payload.headers;
    const from = headers.find(header => header.name === 'From').value;
    const to = headers.find(header => header.name === 'To').value;
    const subject = headers.find(header => header.name === 'Subject').value;

    const reply = [
        `From: ${to}`,
        `To: ${from}`,
        `Subject: ${subject}`,
        `Content-Type: text/html; charset=utf-8`,
        `Content-Transfer-Encoding: quoted-printable`,
        ``,
        `${replyText}`,
    ].join('\r\n').trim();

    await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: Buffer.from(reply).toString('base64').replace(/\+/g, '-').replace(/\//g, '_'),
        },
    });
}


// create label if not exists and return label id
async function createLabel(oAuth2Client, labelName) {
    const gmail = google.gmail({version: 'v1', auth: oAuth2Client});

    const res = await gmail.users.labels.list({
        userId: 'me',
    });

    const label = res.data.labels.find(label => label.name === labelName);

    if (label) {
        return label.id;
    }

    const newLabel = await gmail.users.labels.create({
        userId: 'me',
        requestBody: {
            name: labelName,
            labelListVisibility: 'labelShow',
            messageListVisibility: 'show',
        },
    });

    return newLabel.data.id;
}

// add label to message
async function addLabel(oAuth2Client, message, labelId) {
    const gmail = google.gmail({version: 'v1', auth: oAuth2Client});

    await gmail.users.messages.modify({
        userId: 'me',
        id: message.id,
        requestBody: {
            addLabelIds: [labelId],
        },
    });
}

// remove label from message
async function removeLabel(oAuth2Client, message, labelId) {
    const gmail = google.gmail({version: 'v1', auth: oAuth2Client});

    await gmail.users.messages.modify({
        userId: 'me',
        id: message.id,
        requestBody: {
            removeLabelIds: [labelId],
        },
    });
}

export {getMails, replyMail, addLabel, removeLabel, createLabel};
