import fetch from 'node-fetch';
import Iap from '@withkoji/iap';

export default function (app) {
  app.get('/image', async (req, res) => {
    const { image } = res.locals.koji.general.reveal;

    const revealedImage = `${image}?width=363&height=619&fit=bounds&format=jpg&optimize=low&bg-color=255,255,255,0.5`;
    const blurredImage = `${revealedImage}&blur=30`;

    let hasPurchased = false;
    try {
      const token = req.headers['x-koji-iap-callback-token'];
      const iap = new Iap(
        process.env.KOJI_PROJECT_ID,
        process.env.KOJI_PROJECT_TOKEN,
      );
      const receipts = await iap.resolveReceipts(token);
      hasPurchased = !!(receipts.find(({ product }) => product.sku === 'image'));
    } catch (err) {
      console.log(err);
    }

    res.header('Content-Type', 'image/jpeg');

    if (hasPurchased) {
      res.header('X-Koji-Payment-Required', 'false');
      fetch(revealedImage).then((imageRes) => imageRes.body.pipe(res));
    } else {
      res.header('X-Koji-Payment-Required', 'true');
      fetch(blurredImage).then((imageRes) => imageRes.body.pipe(res));
    }
  });
}
