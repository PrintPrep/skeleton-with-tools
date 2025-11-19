export interface LemonSqueezyProduct {
  id: string;
  name: string;
  interval?: 'month' | 'year' | 'once';
}

export const LEMON_SQUEEZY_PRODUCTS = {
  PRO_MONTHLY: {
    id: '1097562', // Your monthly variant ID
    name: 'Pro Monthly',
    interval: 'month' as const
  },
  PRO_YEARLY: {
    id: '1097577', // Your yearly variant ID
    name: 'Pro Yearly', 
    interval: 'year' as const
  },
  LIFETIME: {
    id: '1097578', // Your lifetime variant ID
    name: 'Lifetime',
    interval: 'once' as const
  }
};

export async function createLemonSqueezyCheckout(
  variantId: string,
  userId: string,
  userEmail: string
): Promise<string> {
  try {
    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
        'Authorization': `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            custom_data: {
              user_id: userId,
              user_email: userEmail
            },
            checkout_options: {
              embed: false,
              media: false,
              button_color: '#0d9488'
            },
            checkout_data: {
              email: userEmail,
              custom: {
                user_id: userId
              }
            }
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: process.env.LEMON_SQUEEZY_STORE_ID
              }
            },
            variant: {
              data: {
                type: 'variants',
                id: variantId
              }
            }
          }
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Lemon Squeezy API error:', errorData);
      throw new Error(`Failed to create checkout: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.data.attributes.url) {
      throw new Error('No checkout URL received from Lemon Squeezy');
    }

    return data.data.attributes.url;
  } catch (error) {
    console.error('Error creating Lemon Squeezy checkout:', error);
    throw error;
  }
}