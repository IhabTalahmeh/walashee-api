import { Injectable } from '@nestjs/common';
import * as http from 'http';

@Injectable()
export class WhatsappService {

    async sendText(to: string, message: string) {
        return new Promise((resolve, reject) => {
            const req = http.request(
                {
                    hostname: 'localhost',
                    port: 3000,
                    path: '/api/sendText',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': process.env.WAHA_API_KEY,
                    },
                },
                (res) => {
                    let body = '';
                    res.on('data', (chunk) => (body += chunk));
                    res.on('end', () => resolve(JSON.parse(body)));
                }
            );

            req.on('error', reject);
            req.write(JSON.stringify({
                chatId: `${to}@c.us`,
                reply_to: null,
                text: message,
                linkPreview: true,
                linkPreviewHighQuality: false,
                session: "default",
            }));
            req.end();
        });
    }

}