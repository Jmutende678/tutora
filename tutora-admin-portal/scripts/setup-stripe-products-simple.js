#!/usr/bin/env node

/**
 * Simple Stripe Product Setup Script
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
  },
  {
    id: 'growth',
    name: 'Tutora Growth',
    description: 'Complete training solution for growing teams',
    baseUsers: 25,
    monthlyPrice: 29900, // $299.00
    annualPrice: 24900,  // $249.00
    additionalUserPrice: 1200, // $12.00 per additional user
  },
  {
    id: 'professional',
    name: 'Tutora Professional',
    description: 'Advanced platform for established organizations',
    baseUsers: 50,
    monthlyPrice: 69900, // $699.00
    annualPrice: 59900,  // $599.00
    additionalUserPrice: 1400, // $14.00 per additional user
  },
  {
    id: 'enterprise',
    name: 'Tutora Enterprise',
    description: 'Full-scale solution for large organizations',
    baseUsers: 100,
    monthlyPrice: 199900, // $1999.00
    annualPrice: 169900,  // $1699.00
    additionalUserPrice: 2000, // $20.00 per additional user
  }
];

async function createProduct(productData) {
  console.log(`\n🔄 Creating ${productData.name}...`);
  
  // Create product
  const product = await stripe.products.create({
    name: productData.name,
    description: productData.description,
    metadata: {
      plan_id: productData.id,
      base_users: productData.baseUsers.toString(),
      additional_user_price: (productData.additionalUserPrice / 100).toString(),
    }
  });
  console.log(`✅ Created product: ${product.name} (${product.id})`);

  // Create monthly base price
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
  console.log(`✅ Created monthly price: $${monthlyPrice.unit_amount / 100} (${monthlyPrice.id})`);

  // Create annual base price
  const annualPrice = await stripe.prices.create({
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
  console.log(`✅ Created annual price: $${annualPrice.unit_amount / 100} (${annualPrice.id})`);

  // Create metered price for additional users (monthly)
  const additionalUsersMonthly = await stripe.prices.create({
    product: product.id,
    unit_amount: productData.additionalUserPrice,
    currency: 'usd',
    recurring: {
      interval: 'month',
      usage_type: 'metered',
      aggregate_usage: 'max'
    },
    metadata: {
      plan_id: productData.id,
      billing_cycle: 'monthly',
      price_type: 'additional_users'
    }
  });
  console.log(`✅ Created additional users monthly: $${additionalUsersMonthly.unit_amount / 100} (${additionalUsersMonthly.id})`);

  // Create metered price for additional users (annual)
  const additionalUsersAnnual = await stripe.prices.create({
    product: product.id,
    unit_amount: productData.additionalUserPrice,
    currency: 'usd',
    recurring: {
      interval: 'month',
      usage_type: 'metered',
      aggregate_usage: 'max'
    },
    metadata: {
      plan_id: productData.id,
      billing_cycle: 'annual',
      price_type: 'additional_users'
    }
  });
  console.log(`✅ Created additional users annual: $${additionalUsersAnnual.unit_amount / 100} (${additionalUsersAnnual.id})`);

  return {
    product,
    monthlyPrice,
    annualPrice,
    additionalUsersMonthly,
    additionalUsersAnnual
  };
}

async function setupStripeProducts() {
  console.log('🚀 Setting up Tutora Stripe products and pricing...\n');
  
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ STRIPE_SECRET_KEY environment variable is required');
    process.exit(1);
  }

  const isLive = process.env.STRIPE_SECRET_KEY.startsWith('sk_live_');
  console.log(`🔑 Using ${isLive ? 'LIVE' : 'TEST'} Stripe keys\n`);

  try {
    const results = [];
    
    for (const productData of PRODUCTS) {
      const result = await createProduct(productData);
      results.push(result);
    }

    console.log('\n🎉 All products and prices created successfully!');
    console.log('\n📋 Price IDs to use in your application:');
    
    results.forEach((result, index) => {
      const product = PRODUCTS[index];
      console.log(`\n${product.name}:`);
      console.log(`  Product ID: ${result.product.id}`);
      console.log(`  Monthly Price ID: ${result.monthlyPrice.id}`);
      console.log(`  Annual Price ID: ${result.annualPrice.id}`);
      console.log(`  Additional Users Monthly ID: ${result.additionalUsersMonthly.id}`);
      console.log(`  Additional Users Annual ID: ${result.additionalUsersAnnual.id}`);
    });

    console.log('\n✅ Copy these IDs to your stripe.ts file!');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupStripeProducts();
