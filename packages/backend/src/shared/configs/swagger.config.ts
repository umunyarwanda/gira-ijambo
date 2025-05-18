import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('GiraIjambo Forum API')
    .setDescription('Testing API for GiraIjambo Forum system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Custom JS for persistent authentication
  const customJs = `
    (function() {
      const tokenKey = 'swagger_token';
      
      window.setAuthToken = function(token) {
        localStorage.setItem(tokenKey, token);
      };

      window.getAuthToken = function() {
        return localStorage.getItem(tokenKey);
      };

      const oldAuthorize = window.ui.authActions.authorize;
      window.ui.authActions.authorize = function(payload) {
        const result = oldAuthorize(payload);
        if (payload.bearerAuth) {
          window.setAuthToken(payload.bearerAuth[0]);
        }
        return result;
      };

      const storedToken = window.getAuthToken();
      if (storedToken) {
        window.ui.authActions.authorize({
          bearerAuth: [storedToken]
        });
      }
    })();
  `;

  app.use('/swagger/custom.js', (req, res) => {
    res.type('application/javascript');
    res.send(customJs);
  });

  SwaggerModule.setup('swagger', app, document, {
    customJs: '/swagger/custom.js',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}