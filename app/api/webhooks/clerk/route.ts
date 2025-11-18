// app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  // ... (keep all the existing webhook verification code)

  try {
    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name } = evt.data;
      const email = email_addresses[0]?.email_address;
      const name = `${first_name || ''} ${last_name || ''}`.trim() || null;

      const placeholderPassword = 'clerk_oauth_user';

      await prisma.user.upsert({
        where: { email: email },
        update: {
          name: name,
        },
        create: {
          id: id,
          email: email,
          name: name,
          password: placeholderPassword,
          role: 'free',
        },
      });

      console.log(`User ${email} synced to database via webhook`);
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data;
      
      await prisma.user.delete({
        where: { id: id },
      });

      console.log(`User with Clerk ID ${id} deleted from database`);
    }

    return new Response('Webhook processed', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Error processing webhook', { status: 500 });
  }
}