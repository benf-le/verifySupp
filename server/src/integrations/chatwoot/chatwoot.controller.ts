import { Controller, All, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const CHATWOOT_TARGET = 'http://103.161.119.68:3000';

@Controller('chatwoot')
export class ChatwootController {
  constructor() {
    // nothing
  }

  @All('*')
  proxy(@Req() req: Request, @Res() res: Response) {
    const proxy = createProxyMiddleware({
      target: CHATWOOT_TARGET,
      changeOrigin: true,
      pathRewrite: { '^/chatwoot': '' }, // xoá prefix /chatwoot khi forward
    });

    return proxy(req, res, (err) => {
      if (err) {
        res.status(500).send('Proxy error');
      }
    });
  }
}
