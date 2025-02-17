const stripe = require('stripe')(process.env.STRIPE_PK);
const express = require('express');
const app = express();
app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:4242';

const priceObj = numberOfWeeks < 3 
? genPriceObj('lessThan3WeeksPrice', 5499) 
: genPriceObj('standardPrice', 3999);

const price = await stripe.prices.create(priceObj); 

function genPriceObj(nickname, unit_amount) {
  return {
    nickname,
    unit_amount,
    product: 'prod_NTYzT8w3Pmm6vQ', // 'prod_RhqTU1SsY1SkCH',
    currency: 'usd',
  }
}

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: price,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
});

  res.redirect(303, session.url);
});

app.listen(4242, () => console.log('Running on port 4242'));