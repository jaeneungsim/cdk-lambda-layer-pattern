/**
 * @file Main CDK stack demonstrating configuration-driven Lambda layer pattern.
 * This follows the same pattern as the multi-lambda project for consistency.
 */

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaLayerConstruct } from './constructs/lambda-layer-construct';
import { LambdaFunctionConstruct } from './constructs/lambda-function-construct';
import { appConfig } from '../config/layer-config';

/**
 * Main application stack showcasing the Lambda layer pattern.
 * Creates layers and functions based on configuration.
 */
export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create layers from configuration
    const layers: Record<string, LambdaLayerConstruct> = {};
    Object.entries(appConfig.layers).forEach(([layerName, layerConfig]) => {
      layers[layerName] = new LambdaLayerConstruct(this, `${layerName}Layer`, {
        layerName,
        config: layerConfig,
      });
    });

    // Create Lambda functions from configuration
    Object.entries(appConfig.lambdaFunctions).forEach(([functionName, functionConfig]) => {
      const layersToUse = functionName === 'sample-lambda-2' 
        ? [layers['moment-layer'].layer] 
        : [layers['uuid-layer'].layer];
      
      new LambdaFunctionConstruct(this, `${functionName}Function`, {
        functionName,
        config: functionConfig,
        layers: layersToUse,
      });
    });
  }
}
