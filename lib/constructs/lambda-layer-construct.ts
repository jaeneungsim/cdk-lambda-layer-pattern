/**
 * @file A reusable CDK construct for creating Lambda layers with automatic bundling.
 * This construct follows the configuration-driven pattern for layer creation.
 */

import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LayerConfig } from '../../config/layer-config';

/**
 * Properties for the LambdaLayerConstruct.
 */
export interface LambdaLayerConstructProps {
  /** The logical name of the layer, used for resource naming and code path. */
  readonly layerName: string;
  /** Configuration for the layer to create. */
  readonly config: LayerConfig;
}

/**
 * A reusable construct that creates a Lambda layer with automatic Node.js bundling.
 * The layer code is expected to be in the layers/{layerName} directory.
 */
export class LambdaLayerConstruct extends Construct {
  /** The created Lambda layer version. */
  public readonly layer: lambda.LayerVersion;

  constructor(scope: Construct, id: string, props: LambdaLayerConstructProps) {
    super(scope, id);

    const { layerName, config } = props;

    // Create layer with Node.js bundling
    this.layer = new lambda.LayerVersion(this, 'Layer', {
      layerVersionName: layerName,
      description: config.description,
      compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
      code: lambda.Code.fromAsset(`layers/${layerName}`, {
        bundling: {
          image: lambda.Runtime.NODEJS_18_X.bundlingImage,
          command: [
            'bash',
            '-c',
            [
              'cd /asset-input',
              'npm install --production',
              'mkdir -p /asset-output/nodejs',
              'cp -r . /asset-output/nodejs/',
            ].join(' && '),
          ],
          user: 'root',
        },
      }),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Export layer ARN for easy reference
    new cdk.CfnOutput(this, 'LayerArn', {
      value: this.layer.layerVersionArn,
      description: `ARN for ${layerName}`,
      exportName: `${layerName}-arn`,
    });
  }
}