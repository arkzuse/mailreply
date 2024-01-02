#!/usr/bin/env node

import {readFile} from "fs/promises";
import {getAuthenticatedClient} from "./auth.js";
import {addLabel, createLabel, getMails, removeLabel, replyMail} from "./gmail.js";

const keys = JSON.parse(
    await readFile(
        new URL('./client_secret.json', import.meta.url)
    )
);

const scope = ['https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.send'];

const replyText = 'This is an automated reply';
const addedLabel = 'AUTOREPLY';
const inboxId = 'INBOX';

async function main() {
    const client = await getAuthenticatedClient(scope, keys);
    const repliedLabelId = await createLabel(client, addedLabel);

    while (true) {
        console.log('Looking for new mails...')
        const messages = await getMails(client);

        console.log(`Found ${messages.length} new mails.`)

        for (const message of messages) {
            await replyMail(client, message, replyText);
            await addLabel(client, message, repliedLabelId);
            await removeLabel(client, message, inboxId);
        }

        const wait = Math.floor(Math.random() * (120 - 45 + 1) + 45);
        console.info(`Waiting ${wait} seconds...`);
        await new Promise(resolve => setTimeout(resolve, wait * 1000));
    }
}

main().catch(console.error);