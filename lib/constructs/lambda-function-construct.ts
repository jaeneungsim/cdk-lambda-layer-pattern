/**
 * @file A custom CDK construct for creating Lambda functions with layer support.
 * This construct encapsulates the common pattern of creating a Lambda function with layers.
 */

import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaConfig } from '../../config/layer-config';

/**
 * Properties for the LambdaFunctionConstruct.
 */
export interface LambdaFunctionConstructProps {
  /** The logical name of the function, used for resource naming and code path. */
  readonly functionName: string;
  /** Configuration for the Lambda function. */
  readonly config: LambdaConfig;
  /** Array of layer versions to attach to the function. */
  readonly layers?: lambda.LayerVersion[];
}

/**
 * A reusable construct that provisions a Lambda function with layer support.
 * The function code is expected to be in the lambda/{functionName} directory.
 */
export class LambdaFunctionConstruct extends Construct {
  /** The Lambda function created by this construct. */
  public readonly lambdaFunction: lambda.Function;

  constructor(scope: Construct, id: string, props: LambdaFunctionConstructProps) {
    super(scope, id);

    const { functionName, config, layers = [] } = props;

    // Create Lambda function from asset directory
    this.lambdaFunction = new lambda.Function(this, 'Function', {
      functionName,
      runtime: config.runtime,
      handler: config.handler,
      code: lambda.Code.fromAsset(`lambda/${functionName}`),
      layers,
      memorySize: config.memorySize,
      timeout: config.timeout ? cdk.Duration.seconds(config.timeout) : undefined,
      environment: config.environment,
    });

    // Export function ARN for reference
    new cdk.CfnOutput(this, 'FunctionArn', {
      value: this.lambdaFunction.functionArn,
      description: `ARN for ${functionName}`,
      exportName: `${functionName}-arn`,
    });
  }
}