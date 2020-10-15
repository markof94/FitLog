import fetch from 'node-fetch';
import Iap from '@withkoji/iap';
import { Keystore } from '@withkoji/vcc';

export default function (app) {
  app.get('/preview', async (req, res) => {
    const now = Math.floor(Date.now() / 1000);
    console.log('got preview request');
    const { image } = res.locals.koji.general;
    
    const keystore = new Keystore();
    const resolvedImage = await keystore.resolveValue(image);
    if (!resolvedImage) {
      console.log('no image found');
      res.sendStatus(404);
      return;
    }

    console.log('resolved image value', (Date.now() / 1000) - now);
    const blurredImage = `${resolvedImage}?format=jpg&optimize=medium&blur=70`;

    res.header('Content-Type', 'image/jpeg');
    const request = await fetch(blurredImage);
    console.log('fetched image', (Date.now() / 1000) - now);
    request.body.pipe(res);
  });

  app.get('/unlocked', async (req, res) => {
    // Use the IAP callback token to see if we can find a receipt matching the SKU of
    // the image. If a receipt exists for the SKU, then we know the user has purchased
    // the image.
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

    // Set the content type, so the browser knows to display an image
    res.header('Content-Type', 'image/jpeg');

    if (!hasPurchased) {
      res.sendStatus(401);
      return;
    }

    // The image is stored using the composable secret VCC, so the value
    // actually written in the file is a keypath that we can query to
    // receive the actual value
    const { image } = res.locals.koji.general;
    
    // Use the Keystore to resolve the value of the image from its keypath
    const keystore = new Keystore();
    const resolvedImage = await keystore.resolveValue(image);
    if (!resolvedImage) {
      console.log('no image found');
      res.sendStatus(404);
      return;
    }

    // Use CDN params to create both the revealed image and the blurred image
    const revealedImage = `${resolvedImage}?format=jpg&optimize=medium`;
    const request = await fetch(revealedImage);
    request.body.pipe(res);
  });
}
