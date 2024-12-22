import config from "common/config";
import basicAuth from "express-basic-auth";

import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
const swaggerUi = require('swagger-ui-express');

export default (app: INestApplication) => {
  if (config.swagger.is_auth) {
    app.use(
      config.swagger.doc_url,
      basicAuth({
        challenge: true,
        users: {
          [config.swagger.username]: config.swagger.password,
        },
      }),
    );
  }

  const options = new DocumentBuilder()
    .setTitle(config.swagger.name)
    .setDescription(config.swagger.description)
    .setVersion(config.swagger.version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  // SwaggerModule.setup(config.swagger.doc_url, app, document, {
  //   swaggerOptions: {
  //     tagsSorter: "alpha",
  //     operationsSorter: "alpha",
  //   },
  // });
  app.use(config.swagger.doc_url, swaggerUi.serve, swaggerUi.setup(document));
};
