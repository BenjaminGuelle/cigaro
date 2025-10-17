import { ValidationPipe, BadRequestException, Logger } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class GlobalValidationPipe extends ValidationPipe {
  private readonly logger = new Logger('ValidationPipe');
  private readonly isProduction = process.env.NODE_ENV === 'production';

  constructor() {
    super({
      // Security & Cleaning
      whitelist: true,              // Supprimer champs non-définis dans DTO
      forbidNonWhitelisted: true,   // Erreur si champs interdits
      forbidUnknownValues: true,    // Rejeter objets sans décorateurs

      // Transformation
      transform: true,              // Auto-transform types (string→number, etc.)
      transformOptions: {
        enableImplicitConversion: true, // '123' → 123 automatiquement
      },

      // Error Handling - Environment aware
      disableErrorMessages: process.env.NODE_ENV === 'production',
      validationError: {
        target: false,              // Ne pas exposer l'objet complet
        value: false,               // Ne pas exposer les valeurs dans erreurs
      },

      // Custom error format
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        // Log pour debug/monitoring
        this.logValidationErrors(validationErrors);

        const formattedErrors = this.formatValidationErrors(validationErrors);

        return new BadRequestException({
          statusCode: 400,
          message: 'Validation failed',
          errors: this.isProduction ? this.sanitizeErrorsForProduction(formattedErrors) : formattedErrors,
          timestamp: new Date().toISOString(),
          ...(this.isProduction ? {} : { debug: true }) // Flag debug en dev
        });
      },
    });
  }

  private formatValidationErrors(
    validationErrors: ValidationError[]
  ): Record<string, string[]> {
    const errors: Record<string, string[]> = {};

    for (const error of validationErrors) {
      if (error.children && error.children.length > 0) {
        const nestedErrors = this.formatValidationErrors(error.children);
        Object.keys(nestedErrors).forEach(key => {
          errors[`${error.property}.${key}`] = nestedErrors[key];
        });
      } else if (error.constraints) {
        errors[error.property] = Object.values(error.constraints);
      }
    }

    return errors;
  }

  private logValidationErrors(validationErrors: ValidationError[]): void {
    if (validationErrors.length === 0) return;

    const errorSummary = validationErrors.map(error => ({
      field: error.property,
      constraints: error.constraints ? Object.keys(error.constraints) : [],
      value: this.isProduction ? '[REDACTED]' : error.value
    }));

    if (this.isProduction) {
      this.logger.warn('Validation failed', {
        errorCount: validationErrors.length,
        fields: errorSummary.map(e => e.field),
        timestamp: new Date().toISOString()
      });
    } else {
      this.logger.debug('Validation failed - Details', {
        errors: errorSummary,
        timestamp: new Date().toISOString()
      });
    }

    // Alerting pour patterns suspects (rate limiting context)
    this.detectSuspiciousPatterns(errorSummary);
  }

  private sanitizeErrorsForProduction(errors: Record<string, string[]>): Record<string, string[]> {
    const sanitized: Record<string, string[]> = {};

    Object.keys(errors).forEach(field => {
      sanitized[field] = ['Invalid value'];
    });

    return sanitized;
  }

  private detectSuspiciousPatterns(errorSummary: any[]): void {
    const suspiciousFields = errorSummary.filter(error =>
      error.constraints.includes('forbidNonWhitelisted') ||
      error.constraints.includes('forbidUnknownValues')
    );

    if (suspiciousFields.length > 0) {
      this.logger.warn('Suspicious validation pattern detected', {
        suspiciousFieldCount: suspiciousFields.length,
        fields: suspiciousFields.map(f => f.field),
        possibleAttack: 'mass_assignment_or_injection_attempt',
        timestamp: new Date().toISOString()
      });
    }

    if (errorSummary.length > 10) {
      this.logger.warn('High validation error volume', {
        errorCount: errorSummary.length,
        possibleAttack: 'fuzzing_or_brute_force',
        timestamp: new Date().toISOString()
      });
    }
  }
}

export const setupGlobalValidation = (app: any) => {
  app.useGlobalPipes(new GlobalValidationPipe());
};