import fetch from 'node-fetch';
import Iap from '@withkoji/iap';
import { Keystore } from '@withkoji/vcc';

export default function (app) {
  app.get('/image', async (req, res) => {
    // The image is stored using the composable secret VCC, so the value
    // actually written in the file is a keypath that we can query to
    // receive the actual value
    const { image } = res.locals.koji.general;
    
    // Use the Keystore to resolve the value of the image from its keypath
    const keystore = new Keystore();
    const resolvedImage = await keystore.resolveValue(image);

    // Use CDN params to create both the revealed image and the blurred image
    const revealedImage = `${resolvedImage}?width=363&height=619&fit=bounds&format=jpg&optimize=low&bg-color=255,255,255,0.5`;
    const blurredImage = `${revealedImage}&blur=30`;

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

    // Use a custom header to let the frontend know whether or not the image
    // it is receiving is the blurred image or the unlocked image. The backend
    // is responsible for fetching the image from the CDN and streaming the
    // result to the client. This way, the raw URL of the image is not leaked.
    if (hasPurchased) {
      res.header('X-Koji-Payment-Required', 'false');
      fetch(revealedImage).then((imageRes) => imageRes.body.pipe(res));
    } else {
      res.header('X-Koji-Payment-Required', 'true');
      fetch(blurredImage).then((imageRes) => imageRes.body.pipe(res));
    }
  });
}
