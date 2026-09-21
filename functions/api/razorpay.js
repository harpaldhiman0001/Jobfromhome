/*
 Cloudflare Pages Functions — functions/api/razorpay.js

 DEPLOYMENT
 - Put this file in your GitHub repository at: functions/api/razorpay.js
 - In Cloudflare Pages -> Settings -> Environment variables, add:
   RAZORPAY_KEY_ID       = rzp_live_... (or rzp_test_... for testing)
   RAZORPAY_KEY_SECRET   = your Razorpay Key Secret (never put this in frontend code)
   ADMIN_API_TOKEN       = a long random private value for future admin endpoints

 This endpoint creates Razorpay Orders and verifies Checkout signatures.
 It does NOT mark a person as hired or guarantee interviews. It returns a verified
 payment record to the frontend after signature verification.
*/

const PLANS = {
  seeker_30: {
    code: 'seeker_30',
    label: 'Job Seeker Apply Plan — 30 days',
    amount: 19900,
    currency: 'INR',
    taxNote: '₹199 inclusive of applicable GST'
  },
  employer_starter: {
    code: 'employer_starter',
    label: 'Employer Starter — one listing for 30 days',
    amount: 59000,
    currency: 'INR',
    taxNote: '₹500 + ₹90 GST (18%) = ₹590'
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}

function publicKey(env) {
  return env.RAZORPAY_KEY_ID || '';
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function hmacSha256Hex(secret, data) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function normaliseEmail(value) {
  return String(value || '').trim().toLowerCase().slice(0, 120);
}

function safeText(value, max) {
  return String(value || '').replace(/[<>]/g, '').trim().slice(0, max);
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
    return json({ success: false, error: 'Payment service is not configured. Add Razorpay environment variables in Cloudflare Pages.' }, 503);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ success: false, error: 'Invalid JSON request.' }, 400);
  }

  const action = payload.action;

  if (action === 'publicConfig') {
    return json({ success: true, keyId: publicKey(env), plans: PLANS });
  }

  if (action === 'createOrder') {
    const plan = PLANS[payload.planCode];
    const name = safeText(payload.name, 80);
    const email = normaliseEmail(payload.email);
    const phone = String(payload.phone || '').replace(/\D/g, '').slice(-10);

    if (!plan) return json({ success: false, error: 'Invalid payment plan.' }, 400);
    if (!name || !/^\S+@\S+\.\S+$/.test(email) || !/^[6-9]\d{9}$/.test(phone)) {
      return json({ success: false, error: 'Enter a valid name, email, and 10-digit Indian mobile number.' }, 400);
    }

    const receipt = `jfh_${plan.code}_${crypto.randomUUID().replace(/-/g, '').slice(0, 18)}`;
    const auth = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`);
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        amount: plan.amount,
        currency: plan.currency,
        receipt,
        notes: {
          product: 'JobFromHome.in',
          plan_code: plan.code,
          customer_name: name,
          customer_email: email,
          customer_phone: phone
        }
      })
    });

    const order = await razorpayResponse.json();
    if (!razorpayResponse.ok) {
      console.error('Razorpay order error', order);
      return json({ success: false, error: 'Could not create the payment order. Please try again.' }, 502);
    }

    return json({
      success: true,
      keyId: publicKey(env),
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      },
      plan
    });
  }

  if (action === 'verifyPayment') {
    const orderId = safeText(payload.razorpay_order_id, 100);
    const paymentId = safeText(payload.razorpay_payment_id, 100);
    const signature = safeText(payload.razorpay_signature, 256);
    const planCode = safeText(payload.planCode, 40);

    if (!PLANS[planCode] || !orderId || !paymentId || !signature) {
      return json({ success: false, error: 'Incomplete payment verification data.' }, 400);
    }

    const generated = await hmacSha256Hex(env.RAZORPAY_KEY_SECRET, `${orderId}|${paymentId}`);
    if (!timingSafeEqual(generated, signature)) {
      return json({ success: false, error: 'Payment signature verification failed. No plan was activated.' }, 400);
    }

    return json({
      success: true,
      verified: true,
      payment: {
        orderId,
        paymentId,
        planCode,
        verifiedAt: new Date().toISOString()
      },
      message: 'Payment verified. Save this record in your backend before granting paid access.'
    });
  }

  return json({ success: false, error: 'Unknown action.' }, 404);
}
