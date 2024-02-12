import { Controller, Get, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { PassThrough } from 'stream';
import { faker } from '@faker-js/faker';

@Controller()
export class AppController {
  constructor() { }

  @Get('stream')
  streamData(@Res() res: Response, @Req() req: Request) {
    let index = 0;
    const stream = new PassThrough();
    const numOfUsers = 10;
    const users = [];
    for (let i = 0; i < 10; i++) {
      users.push({
        username: faker.person.firstName(),
      });
    }
    stream.pipe(res);
    const intervalId = setInterval(async () => {
      if (index > 8) {
        res.write(Buffer.from(JSON.stringify(users)));
        res.end();
        clearInterval(intervalId);
        return;
      }
      index++;
      stream.write(Buffer.from(JSON.stringify((index / numOfUsers) * 100)));
    }, 1000);

    req.on('close', () => {
      clearInterval(intervalId);
      res.end();
    });
  }
}
