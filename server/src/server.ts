import express, { Router } from 'express';
import Config from './config/config';
import routes from './routes/routes';
import cookieParser from 'cookie-parser';
import { startAuctionCloser } from './jobs/close_auction';
import { startSellerPermissionExpirer } from './jobs/expire_seller_permissions';
import path from 'path';

async function main() {
  const config: Config = new Config();

  const app = express();
  app.use(cookieParser());
  app.use(express.json({ limit: '500mb' }));
  app.use(express.urlencoded({ limit: '500mb', extended: true }));

  app.use('/api/', routes);
  const staticDir = path.join(__dirname, './views/dist');
  app.use(express.static(staticDir));
  app.get(/(.*)/, (_, res) => {
    return res.sendFile(path.join(staticDir, 'index.html'));
  });

  startAuctionCloser();
  startSellerPermissionExpirer();

  app.listen(config.PORT, () => {
    console.log(`Server listening on port ${config.PORT}`);
  });
}

main();
