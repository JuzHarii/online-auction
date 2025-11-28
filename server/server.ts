import express, {Router} from "express";
import Config from "./config/config.ts";
import routes from "./routes/routes.ts"

import cookie from "cookie-parser"
import cookieParser from "cookie-parser";


async function main() {
  const config: Config = new Config();

  const app = express();
  
  app.use(express.static("dist"));

  app.use(express.json());

  app.use(cookieParser())

  const router = Router();
  app.use(router);

  app.use("/api/", routes);
  
  app.listen(config.PORT, ( )=> {
    console.log(`Server listening on port ${config.PORT}`);
  });
}

main();
