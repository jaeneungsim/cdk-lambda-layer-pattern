# CDK Lambda Layer Pattern

A professional reference implementation demonstrating how to create and manage multiple AWS Lambda functions with shared Lambda layers using AWS CDK and TypeScript. This project showcases a configuration-driven approach for scalable serverless architecture.

## Key Features

- **Configuration-Driven**: Single source of truth for all Lambda layers and functions
- **Reusable Lambda Layers**: Shared code and dependencies across multiple functions
- **TypeScript Support**: Full type safety throughout the CDK infrastructure code
- **Docker Bundling**: Automatic dependency management and packaging
- **Modular Design**: Easy to extend with new layers and functions

## Architecture

This project demonstrates a clean separation between:
- **Lambda Layers**: Shared libraries and utilities (UUID, Moment)
- **Lambda Functions**: Business logic that consumes the layers
- **Configuration**: Centralized definition of all resources

```
┌─────────────────┐    ┌─────────────────┐
│   UUID Layer    │    │  Moment Layer   │
│   - uuid lib    │    │  - moment lib   │
└─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│ Sample Lambda 1 │    │ Sample Lambda 2 │
│ Uses UUID Layer │    │Uses Moment Layer│
└─────────────────┘    └─────────────────┘
```

## Project Structure

```
├── bin/
│   └── app.ts                 # CDK app entry point
├── config/
│   └── layer-config.ts        # Configuration for layers and functions
├── layers/
│   ├── uuid-layer/
│   │   ├── package.json       # UUID dependencies
│   │   └── index.js           # UUID utilities
│   └── moment-layer/
│       ├── package.json       # Moment dependencies
│       └── index.js           # Moment utilities
├── lambda/
│   ├── sample-lambda/
│   │   └── index.js           # Lambda using UUID layer
│   └── sample-lambda-2/
│       └── index.js           # Lambda using Moment layer
├── lib/
│   ├── app-stack.ts           # Main CDK stack
│   └── constructs/
│       ├── lambda-layer-construct.ts    # Reusable layer construct
│       └── lambda-function-construct.ts # Reusable function construct
└── test/
    └── app.test.ts            # Unit tests
```

## Prerequisites

- AWS CLI configured with appropriate permissions
- Node.js 18.x or later
- AWS CDK CLI (`npm install -g aws-cdk`)
- Docker (for layer bundling)

## Setup and Deployment

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd app
   npm install
   ```

2. **Bootstrap CDK (first time only)**
   ```bash
   cdk bootstrap
   ```

3. **Deploy the Stack**
   ```bash
   cdk deploy
   ```

4. **Verify Deployment**
   ```bash
   aws lambda list-functions --query 'Functions[?starts_with(FunctionName, `AppStack`)].FunctionName'
   aws lambda list-layers --query 'Layers[*].LayerName'
   ```

## Testing the Lambda Functions

After deployment, you can test the functions using AWS CLI:

**Test Sample Lambda 1 (UUID)**:
```bash
aws lambda invoke --function-name sample-lambda --payload '{}' output.json
cat output.json
```

**Test Sample Lambda 2 (Moment)**:
```bash
aws lambda invoke --function-name sample-lambda-2 --payload '{}' output.json
cat output.json
```

## How to Add a New Lambda Layer and Function

1. **Create Layer Directory and Files**:
   ```bash
   mkdir -p layers/my-new-layer
   cd layers/my-new-layer
   ```

2. **Add package.json**:
   ```json
   {
     "name": "my-new-layer",
     "version": "1.0.0",
     "dependencies": {
       "your-dependency": "^1.0.0"
     }
   }
   ```

3. **Add index.js with utilities**:
   ```javascript
   const yourLib = require('your-dependency');
   
   module.exports = {
     yourFunction: () => yourLib.doSomething()
   };
   ```

4. **Update Configuration** (`config/layer-config.ts`):
   ```typescript
   layers: {
     // ... existing layers
     'my-new-layer': {
       description: 'Layer containing my new utilities',
     },
   },
   lambdaFunctions: {
     // ... existing functions
     'my-new-function': {
       runtime: Runtime.NODEJS_18_X,
       handler: 'index.handler',
       memorySize: 128,
       timeout: 30,
     },
   }
   ```

5. **Create Lambda Function**:
   ```bash
   mkdir -p lambda/my-new-function
   # Add your lambda code in lambda/my-new-function/index.js
   ```

6. **Update Stack Logic** (if needed for custom layer assignment):
   ```typescript
   // In lib/app-stack.ts, modify layer assignment logic
   ```

7. **Deploy**:
   ```bash
   cdk deploy
   ```

## Useful CDK Commands

- `npm run build`   - Compile TypeScript to JavaScript
- `npm run watch`   - Watch for changes and compile
- `npm run test`    - Perform the jest unit tests
- `cdk deploy`      - Deploy this stack to your default AWS account/region
- `cdk diff`        - Compare deployed stack with current state
- `cdk synth`       - Emits the synthesized CloudFormation template
- `cdk destroy`     - Remove the stack from AWS

## Layer Architecture Details

**Layer Bundling Process**:
1. CDK uses Docker to create a consistent build environment
2. Dependencies are installed in the container
3. Files are packaged in the required `/opt/nodejs/` structure
4. Layer is uploaded to S3 and registered with Lambda

**Layer Usage in Functions**:
- Layers are mounted at `/opt/nodejs/`
- Functions import using `require('/opt/nodejs/index')`
- Multiple layers can be combined per function

## License

MIT License - see the LICENSE file for details.

---

This project demonstrates enterprise-grade patterns for managing Lambda layers and functions at scale using AWS CDK.