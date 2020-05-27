import Koji from '@withkoji/vcc';
import fetch from 'node-fetch';

export default function (app) {
  app.get('/image', async (req, res) => {
    const { image } = res.locals.koji.general;
    const blurredImage = `${image}&blur=20`;

    let hasPurchased = false;
    try {
      const token = req.headers['x-koji-iap-callback-token'];
      const request = await fetch('http://localhost:3125/v1/iap/consumer/resolveReceipts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Koji-App-Id': process.env.KOJI_PROJECT_ID,
          'X-Koji-App-Token': process.env.KOJI_PROJECT_TOKEN,
          'X-Koji-Iap-Callback-Token': token,
        },
      });

      const { receipts } = await request.json();
      hasPurchased = !!(receipts.find(({ product }) => product.sku === 'image'));
    } catch (err) {
      //
    }

    if (hasPurchased) {
      res.header('X-Koji-Payment-Required', 'false');
      fetch(image).then((imageRes) => imageRes.body.pipe(res));
    } else {
      res.header('X-Koji-Payment-Required', 'true');
      fetch(blurredImage).then((imageRes) => imageRes.body.pipe(res));
    }
  });
}
