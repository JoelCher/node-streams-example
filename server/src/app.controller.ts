import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';
import { PassThrough } from 'stream';
import { faker } from '@faker-js/faker'
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  @Get('stream')
  streamData(@Res() res: Response, @Req() req: Request) {
    let index = 0;
    const pipe = new PassThrough();
    const numOfUsers = 10;
    const users = [];
    for (let i = 0; i < 10; i++) {
      users.push({
        username: faker.person.firstName(),
      });
    }
    pipe.pipe(res);
    const intervalId = setInterval(async () => {
      if (index > 8) {
        res.write(Buffer.from(JSON.stringify(users)))
        res.end()
        clearInterval(intervalId)
        return
      }
      index++;
      pipe.write(Buffer.from(JSON.stringify((index / numOfUsers) * 100)))
    }, 1000);

    req.on('close', () => {
      clearInterval(intervalId);
      res.end()
    });
  }
}
