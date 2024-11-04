#!/bin/bash

# Check if Python 3.11 is installed
if ! command -v python3.11 &> /dev/null; then
    echo "python3.11 is not installed. Please install it and try again."
    exit 1
fi

# Load configurations from stack.conf if exists
if [[ -f stack.conf ]]; then
    while IFS='=' read -r key value; do
        case "$key" in
            'Stage') Stage=$value ;;
            'Region') Region=$value ;;
            'APPDomain') APPDomain=$value ;;
            'CustomDomain') CustomDomain=$value ;;
        esac
    done < stack.conf
fi

# Function to prompt and validate values
prompt_value() {
    local var_name="$1"
    local prompt_msg="$2"
    local default_value="$3"
    local validation_regex="$4"

    # If the variable is already set (from stack.conf), no need to prompt
    if [ -n "${!var_name}" ]; then
        return
    fi

    while true; do
        echo "$prompt_msg"
        read -r input_value
        input_value="${input_value:-$default_value}"

        if [[ ! $input_value =~ $validation_regex ]]; then
            echo "Invalid value. Try again."
            continue
        fi

        eval "$var_name='$input_value'"
        break
    done
}

# Prompt and validate the values if not provided in stack.conf
prompt_value APPDomain "Enter the app domain (e.g., example.com):" "" "^[a-zA-Z0-9.-]+$"
prompt_value CustomDomain "Use custom domain? (yes/no):" "no" "^(yes|no)$"
prompt_value Stage "Enter the environment name (dev, qa, prod):" "dev" "^(dev|qa|prod)$"
prompt_value Region "Enter the region name:" "us-east-1" "^[a-zA-Z0-9-]+$"

# Display values
echo "APP Domain: $APPDomain"
echo "Custom Domain: $CustomDomain"
echo "Stage: $Stage"
echo "Region: $Region"

read -p "Press Enter to proceed or Ctrl+C to exit..."

# Update and install tools
python3.11 -m pip install --upgrade pip
pip install --upgrade awscli aws-sam-cli

# Create or verify S3 bucket
Hyphen="-"
BucketName="${Stage}.${APPDomain}-deploy"
DEFAULT_CERT_ARN="default-certificate-arn"
DEFAULT_HOSTED_ZONE_ID="default-hosted-zone-id"

capture_stack_outputs() {
    echo "Fetching outputs from the stack: $1-cert-stack in region us-east-1"
    CERT_ARN=$(aws cloudformation describe-stacks --stack-name "$1-cert-stack" --region us-east-1 --query "Stacks[0].Outputs[?OutputKey=='CertificateArn'].OutputValue" --output text 2>/dev/null)

    if [ -z "$CERT_ARN" ] || [ "$CERT_ARN" == "None" ]; then
        echo "Failed to retrieve CertificateArn from the certificate stack in us-east-1, using default."
        CERT_ARN="$DEFAULT_CERT_ARN"
    else
        echo "Successfully retrieved CertificateArn: $CERT_ARN"
    fi

    HOSTED_ZONE_ID=$(aws cloudformation describe-stacks --stack-name "$1-cert-stack" --region us-east-1 --query "Stacks[0].Outputs[?OutputKey=='HostedZoneId'].OutputValue" --output text 2>/dev/null)

    if [ -z "$HOSTED_ZONE_ID" ] || [ "$HOSTED_ZONE_ID" == "None" ]; then
        echo "Failed to retrieve HostedZoneId from the certificate stack in us-east-1, using default."
        HOSTED_ZONE_ID="$DEFAULT_HOSTED_ZONE_ID"
    else
        echo "Successfully retrieved HostedZoneId: $HOSTED_ZONE_ID"
    fi

    echo "Final CertificateArn: $CERT_ARN"
    echo "Final HostedZoneId: $HOSTED_ZONE_ID"
}

TemplateName="template.yaml"
StackName=${Stage}${Hyphen}${APPDomain//./-}

if [[ "$CustomDomain" == "yes" ]]; then
    echo "Deploying the certificate stack since Stage is 'prod'."
    sam deploy -t certificate.yaml --stack-name "$StackName-cert-stack" --s3-bucket "$BucketName" --region us-east-1 --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND CAPABILITY_NAMED_IAM --parameter-overrides AppName="$APPDomain" Region="$Region" Stage="$Stage" StackName="$StackName" UseCustomDomain="$CustomDomain"
fi

capture_stack_outputs "$StackName"
sam deploy -t "$TemplateName" --stack-name "$StackName" --s3-bucket "$BucketName" --region "$Region" --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND CAPABILITY_NAMED_IAM --parameter-overrides AppName="$APPDomain" Region="$Region" Stage="$Stage" StackName="$StackName" UseCustomDomain="$CustomDomain" CertificateArn="$CERT_ARN" HostedZoneId="$HOSTED_ZONE_ID"

# Sync files to S3
ws s3 sync app/build s3://"${Stage}.${APPDomain}"
