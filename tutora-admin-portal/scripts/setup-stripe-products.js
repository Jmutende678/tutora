#!/usr/bin/env node

/**
 * Stripe Product Setup Script
 * Creates products and prices for Tutora with overage billing
 */

const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const PRODUCTS = [
  {
    id: 'starter',
    name: 'Tutora Starter',
    description: 'Perfect for small teams getting started with AI training',
    baseUsers: 10,
    monthlyPrice: 8900, // $89.00 in cents
    annualPrice: 7500,  // $75.00 in cents (annual discount)
    additionalUserPrice: 800, // $8.00 per additional user
    moduleLimit: 10
  },
  {
    id: 'growth',
    name: 'Tutora Growth',
    description: 'Complete training solution for growing teams',
    baseUsers: 25,
    monthlyPrice: 29900, // $299.00
    annualPrice: 24900,  // $249.00
    additionalUserPrice: 1200, // $12.00 per additional user
    moduleLimit: -1 // unlimited
  },
  {
    id: 'professional',
    name: 'Tutora Professional',
    description: 'Advanced platform for established organizations',
    baseUsers: 50,
    monthlyPrice: 69900, // $699.00
    annualPrice: 59900,  // $599.00
    additionalUserPrice: 1400, // $14.00 per additional user
    moduleLimit: -1 // unlimited
  },
  {
    id: 'enterprise',
    name: 'Tutora Enterprise',
    description: 'Full-scale solution for large organizations',
    baseUsers: 100,
    monthlyPrice: 199900, // $1999.00
    annualPrice: 169900,  // $1699.00
    additionalUserPrice: 2000, // $20.00 per additional user
    moduleLimit: -1 // unlimited
  }
];

async function createOrUpdateProduct(productData) {
  try {
    console.log(`\n🔄 Setting up ${productData.name}...`);
    
    // Create or retrieve product
    let product;
    try {
      product = await stripe.products.retrieve(`prod_tutora_${productData.id}`);
      console.log(`✅ Product exists: ${product.name}`);
    } catch (error) {
      if (error.code === 'resource_missing') {
        product = await stripe.products.create({
          id: `prod_tutora_${productData.id}`,
          name: productData.name,
          description: productData.description,
          metadata: {
            plan_id: productData.id,
            base_users: productData.baseUsers.toString(),
            additional_user_price: (productData.additionalUserPrice / 100).toString(),
            module_limit: productData.moduleLimit.toString()
          }
        });
        console.log(`✅ Created product: ${product.name}`);
      } else {
        throw error;
      }
    }

    // Create monthly base price
    console.log(`🔄 Creating monthly price for ${productData.name}...`);
    const monthlyPrice = await stripe.prices.create({
          product: product.id,
          unit_amount: productData.monthlyPrice,
          currency: 'usd',
          recurring: {
            interval: 'month'
          },
          metadata: {
            plan_id: productData.id,
            billing_cycle: 'monthly',
            base_users: productData.baseUsers.toString()
          }
        });
        console.log(`✅ Created monthly price: $${monthlyPrice.unit_amount / 100}`);
      } else {
        throw error;
      }
    }

    // Create annual base price
    let annualPrice;
    try {
      annualPrice = await stripe.prices.retrieve(`price_tutora_${productData.id}_annual`);
      console.log(`✅ Annual price exists: $${annualPrice.unit_amount / 100}`);
    } catch (error) {
      if (error.code === 'resource_missing') {
        annualPrice = await stripe.prices.create({
          product: product.id,
          unit_amount: productData.annualPrice * 12, // Annual price * 12 months
          currency: 'usd',
          recurring: {
            interval: 'year'
          },
          metadata: {
            plan_id: productData.id,
            billing_cycle: 'annual',
            base_users: productData.baseUsers.toString()
          }
        });
        console.log(`✅ Created annual price: $${annualPrice.unit_amount / 100}`);
      } else {
        throw error;
      }
    }

    // Create metered price for additional users (monthly)
    let additionalUsersMonthly;
    try {
      additionalUsersMonthly = await stripe.prices.retrieve(`price_tutora_${productData.id}_users_monthly`);
      console.log(`✅ Additional users monthly price exists: $${additionalUsersMonthly.unit_amount / 100}`);
    } catch (error) {
      if (error.code === 'resource_missing') {
        additionalUsersMonthly = await stripe.prices.create({
          product: product.id,
          unit_amount: productData.additionalUserPrice,
          currency: 'usd',
          recurring: {
            interval: 'month',
            usage_type: 'metered',
            aggregate_usage: 'max' // Use the maximum number of users during the billing period
          },
          metadata: {
            plan_id: productData.id,
            billing_cycle: 'monthly',
            price_type: 'additional_users'
          }
        });
        console.log(`✅ Created additional users monthly price: $${additionalUsersMonthly.unit_amount / 100}`);
      } else {
        throw error;
      }
    }

    // Create metered price for additional users (annual)
    let additionalUsersAnnual;
    try {
      additionalUsersAnnual = await stripe.prices.retrieve(`price_tutora_${productData.id}_users_annual`);
      console.log(`✅ Additional users annual price exists: $${additionalUsersAnnual.unit_amount / 100}`);
    } catch (error) {
      if (error.code === 'resource_missing') {
        additionalUsersAnnual = await stripe.prices.create({
          product: product.id,
          unit_amount: productData.additionalUserPrice,
          currency: 'usd',
          recurring: {
            interval: 'month', // Still billed monthly even for annual plans
            usage_type: 'metered',
            aggregate_usage: 'max'
          },
          metadata: {
            plan_id: productData.id,
            billing_cycle: 'annual',
            price_type: 'additional_users'
          }
        });
        console.log(`✅ Created additional users annual price: $${additionalUsersAnnual.unit_amount / 100}`);
      } else {
        throw error;
      }
    }

    return {
      product,
      monthlyPrice,
      annualPrice,
      additionalUsersMonthly,
      additionalUsersAnnual
    };

  } catch (error) {
    console.error(`❌ Error setting up ${productData.name}:`, error.message);
    throw error;
  }
}

async function setupStripeProducts() {
  console.log('🚀 Setting up Tutora Stripe products and pricing...\n');
  
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ STRIPE_SECRET_KEY environment variable is required');
    process.exit(1);
  }

  if (!process.env.STRIPE_SECRET_KEY.startsWith('sk_live_') && !process.env.STRIPE_SECRET_KEY.startsWith('sk_test_')) {
    console.error('❌ Invalid STRIPE_SECRET_KEY format');
    process.exit(1);
  }

  const isLive = process.env.STRIPE_SECRET_KEY.startsWith('sk_live_');
  console.log(`🔑 Using ${isLive ? 'LIVE' : 'TEST'} Stripe keys\n`);

  try {
    const results = [];
    
    for (const productData of PRODUCTS) {
      const result = await createOrUpdateProduct(productData);
      results.push(result);
    }

    console.log('\n🎉 All products and prices created successfully!');
    console.log('\n📋 Summary:');
    
    results.forEach((result, index) => {
      const product = PRODUCTS[index];
      console.log(`\n${product.name}:`);
      console.log(`  Product ID: ${result.product.id}`);
      console.log(`  Monthly Price ID: ${result.monthlyPrice.id}`);
      console.log(`  Annual Price ID: ${result.annualPrice.id}`);
      console.log(`  Additional Users Monthly ID: ${result.additionalUsersMonthly.id}`);
      console.log(`  Additional Users Annual ID: ${result.additionalUsersAnnual.id}`);
    });

    console.log('\n✅ Stripe setup complete! You can now use these price IDs in your application.');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run the setup
if (require.main === module) {
  setupStripeProducts();
}

module.exports = { setupStripeProducts };
