import express, {Router} from "express";
import Config from "./config/config.ts";

import routes from "./routes/routes.ts"
import cors from "cors"; 


async function main() {
  const config: Config = new Config();

  const app = express();

  
  app.use(cors());
  app.use(express.static("dist"));

  app.use(express.json());

  const router = Router();
  app.use(router);

  app.use("/api/", routes);
  


  app.listen(config.PORT, ( )=> {
    console.log(`Server listening on port ${config.PORT}`);
  });
}

main();
