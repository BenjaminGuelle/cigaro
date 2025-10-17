import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

import { setupGlobalValidation } from './common/pipes/validation.pipe';
import { setupGlobalExceptionFilter } from './common/filters/all-exceptions.filter';
import { SerializeInterceptor } from './common/interceptors/serialize.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  setupGlobalValidation(app);

  setupGlobalExceptionFilter(app);

  app.useGlobalInterceptors(new SerializeInterceptor(app.get('Reflector')));

  app.use((req, res, next) => {
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-XSS-Protection', '1; mode=block');
    res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  if (process.env.NODE_ENV === 'development') {
    Logger.log('🚀 Development mode enabled');
    Logger.log('📝 Detailed error logging active');
  } else {
    Logger.log('🏭 Production mode enabled');
    Logger.log('🔒 Security headers active');
  }

  const port = process.env.PORT || 3000;

  await app.listen(port);

  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`📊 Health check: http://localhost:${port}/${globalPrefix}/health`);
  Logger.log(`🛡️ Guards: JWT Auth, Role, Owner, ClubMember - Active`);
  Logger.log(`✅ Validation: Global pipes with security - Active`);
  Logger.log(`🎯 Serialization: Privacy-aware responses - Active`);
  Logger.log(`🚨 Exception handling: Structured logging - Active`);
}

bootstrap().catch((error) => {
  Logger.error('❌ Application failed to start', error);
  process.exit(1);
});