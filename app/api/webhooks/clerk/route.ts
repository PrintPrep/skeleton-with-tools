// app/api/webhooks/clerk/route.ts - COMPLETE FIXED VERSION
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { PrismaClient, PlanType } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    console.error('❌ Missing CLERK_WEBHOOK_SIGNING_SECRET');
    return new Response('Webhook secret not configured', { status: 500 });
  }

  try {
    // Get headers - headers() returns a Promise in App Router
    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error('❌ Missing Svix headers');
      return new Response('Missing Svix headers', { status: 400 });
    }

    // Get body
    const payload = await req.text();
    const body = JSON.parse(payload);

    // Verify webhook
    const wh = new Webhook(SIGNING_SECRET);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(payload, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error('❌ Webhook verification failed:', err);
      return new Response('Verification failed', { status: 400 });
    }

    const eventType = evt.type;
    console.log(`🔧 Clerk Webhook: ${eventType}`, evt.data.id);

    // Process the webhook event
    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name } = evt.data;
      const email = email_addresses[0]?.email_address;
      
      if (!email) {
        console.error('❌ No email found for user:', id);
        return new Response('No email found', { status: 400 });
      }

      const name = `${first_name || ''} ${last_name || ''}`.trim() || null;
      const placeholderPassword = 'clerk_oauth_user';

      // Create/update user with consistent role
      const user = await prisma.user.upsert({
        where: { email: email },
        update: {
          name: name,
          role: 'user', // CHANGED FROM 'free' to 'user'
        },
        create: {
          id: id,
          email: email,
          name: name,
          password: placeholderPassword,
          role: 'user', // CHANGED FROM 'free' to 'user'
          isPro: false,
        },
      });

      // CRITICAL: Ensure UserStatus record exists
      await prisma.userStatus.upsert({
        where: { userid: id },
        update: {},
        create: {
          userid: id,
          planType: PlanType.FREE,
          storageUsed: 0,
          storageLimit: 1073741824, // 1GB
          filesUploaded: 0,
          maxFilesPerMonth: 10,
          canUseAdvancedTools: false,
          canRemoveWatermark: false,
          canBulkProcess: false,
        },
      });

      console.log(`✅ User ${email} synced to database via webhook`);
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data;
      
      await prisma.user.delete({
        where: { id: id },
      });

      console.log(`🗑️ User with Clerk ID ${id} deleted from database`);
    }

    return new Response('Webhook processed successfully', { status: 200 });
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    return new Response('Error processing webhook', { status: 500 });
  }
}