/**
 * @file This is the single source of truth for defining Lambda layers and functions.
 * This configuration-driven approach allows for easy management and deployment of resources.
 */

import { Runtime } from 'aws-cdk-lib/aws-lambda';

/**
 * Configuration for a Lambda layer.
 */
export interface LayerConfig {
  /** Description of the layer. */
  readonly description: string;
}

/**
 * Configuration for a Lambda function.
 */
export interface LambdaConfig {
  /** Lambda runtime environment. */
  readonly runtime: Runtime;
  /** Function handler (entry point). */
  readonly handler: string;
  /** Memory size in MB. */
  readonly memorySize?: number;
  /** Function timeout in seconds. */
  readonly timeout?: number;
  /** Environment variables for the function. */
  readonly environment?: Record<string, string>;
}

/**
 * Root configuration interface for the application.
 */
export interface AppConfig {
  /** Map of layer names to their configurations. */
  readonly layers: Record<string, LayerConfig>;
  /** Map of function names to their configurations. */
  readonly lambdaFunctions: Record<string, LambdaConfig>;
}

/**
 * Application configuration - single source of truth for all resources.
 */
export const appConfig: AppConfig = {
  layers: {
    'uuid-layer': {
      description: 'Layer containing UUID generation utilities',
    },
    'moment-layer': {
      description: 'Layer containing moment date/time utilities',
    },
  },
  lambdaFunctions: {
    'sample-lambda': {
      runtime: Runtime.NODEJS_18_X,
      handler: 'index.handler',
      memorySize: 128,
      timeout: 30,
      environment: {
        NODE_ENV: 'production',
      },
    },
    'sample-lambda-2': {
      runtime: Runtime.NODEJS_18_X,
      handler: 'index.handler',
      memorySize: 128,
      timeout: 30,
      environment: {
        NODE_ENV: 'production',
      },
    },
  },
};