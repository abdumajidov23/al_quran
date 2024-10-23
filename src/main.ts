import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
// import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function start() {
  try {
    const PORT = process.env.PORT || 3000;
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());  
    app.useGlobalPipes(new ValidationPipe());
    // app.useGlobalPipes(new CustomValidationPipe());
    const config = new DocumentBuilder()
      .setTitle("Stadium finder project")
      .setDescription("Stadium finder project REST API")
      .setVersion("1.0")
      .addTag("NESTJS, validation, mailer, bot,swagger, guard, sequelize, pg")
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document);
    await app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}
start();




// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const PORT = process.env.PORT;
//   const app = await NestFactory.create(AppModule);
//   await app.listen(PORT, ()=> console.log("hello"));

// }
// bootstrap();
