#!/bin/bash

###############################################################################
# AWS CloudShell - IAM Users Deployment Script
# Atelier Shreenu - SRD Digital Ecosystem Team Setup
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "=========================================="
echo "  🚀 Atelier Shreenu - IAM Setup"
echo "  AWS CloudShell Deployment"
echo "=========================================="
echo ""

# Verify we're in CloudShell
if [ -z "$AWS_EXECUTION_ENV" ] && [ -z "$CLOUDSHELL" ]; then
    echo -e "${YELLOW}⚠️  Warning: Not detected as CloudShell environment${NC}"
    echo "   This script is optimized for AWS CloudShell"
    echo ""
fi

# Get current AWS account info
echo -e "${BLUE}📋 AWS Account Information:${NC}"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=$(aws configure get region || echo "ap-south-1")
USER_ARN=$(aws sts get-caller-identity --query Arn --output text)

echo "   Account ID: $ACCOUNT_ID"
echo "   Region: $REGION"
echo "   Current User: $USER_ARN"
echo ""

# Check Terraform version
echo -e "${BLUE}🔍 Checking Terraform...${NC}"
if command -v terraform &> /dev/null; then
    TF_VERSION=$(terraform version -json | grep -o '"terraform_version":"[^"]*"' | cut -d'"' -f4)
    echo -e "   ${GREEN}✅ Terraform found: v$TF_VERSION${NC}"
else
    echo -e "   ${RED}❌ Terraform not found!${NC}"
    echo "   Please ensure you're using AWS CloudShell which has Terraform pre-installed"
    exit 1
fi
echo ""

# Initialize Terraform
echo "=========================================="
echo "  Step 1: Initialize Terraform"
echo "=========================================="
terraform init
echo ""

# Validate configuration
echo "=========================================="
echo "  Step 2: Validate Configuration"
echo "=========================================="
terraform validate
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Configuration is valid${NC}"
else
    echo -e "${RED}❌ Configuration validation failed${NC}"
    exit 1
fi
echo ""

# Create execution plan
echo "=========================================="
echo "  Step 3: Create Deployment Plan"
echo "=========================================="
terraform plan -out=tfplan
echo ""

# Show what will be created
echo "=========================================="
echo "  📦 Resources to be Created:"
echo "=========================================="
echo ""
echo -e "${GREEN}✓${NC} 3 IAM Users:"
echo "    • ranjith (ReadOnlyAccess)"
echo "    • aasim (AdministratorAccess)"
echo "    • suhas (AdministratorAccess)"
echo ""
echo -e "${GREEN}✓${NC} Console Access:"
echo "    • Auto-generated passwords (must change on first login)"
echo ""
echo -e "${GREEN}✓${NC} Programmatic Access:"
echo "    • Access Key + Secret Key for each user"
echo ""
echo -e "${GREEN}✓${NC} Custom SRD Ecosystem Policy:"
echo "    • DynamoDB, SES, Lex, Bedrock, Lambda, etc."
echo ""

# Confirm deployment
echo "=========================================="
echo "  ⚠️  Confirmation Required"
echo "=========================================="
echo ""
read -p "Deploy these resources? (yes/no): " CONFIRM
echo ""

if [ "$CONFIRM" != "yes" ]; then
    echo -e "${YELLOW}❌ Deployment cancelled${NC}"
    rm -f tfplan
    exit 0
fi

# Apply Terraform configuration
echo "=========================================="
echo "  Step 4: Deploy IAM Users"
echo "=========================================="
terraform apply tfplan
echo ""

# Check if apply was successful
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Deployment failed!${NC}"
    rm -f tfplan
    exit 1
fi

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""

# Save credentials
echo "=========================================="
echo "  Step 5: Save Credentials"
echo "=========================================="

# Create credentials directory
mkdir -p ~/iam-credentials
CREDS_FILE=~/iam-credentials/team-credentials-$(date +%Y%m%d-%H%M%S).json

# Save all credentials to JSON
terraform output -json > "$CREDS_FILE"
echo -e "${GREEN}✅ Credentials saved to: $CREDS_FILE${NC}"
echo ""

# Display user summary
echo "=========================================="
echo "  👥 IAM Users Created"
echo "=========================================="
terraform output user_summary
echo ""

# Show console login URL
echo "=========================================="
echo "  🔐 Console Login Information"
echo "=========================================="
echo ""
echo "Console URL: https://$ACCOUNT_ID.signin.aws.amazon.com/console"
echo ""

# Extract and display passwords (sensitive)
echo "=========================================="
echo "  🔑 User Credentials (SAVE THESE NOW!)"
echo "=========================================="
echo ""
echo -e "${YELLOW}⚠️  These credentials will NOT be shown again!${NC}"
echo ""

# Display Ranjith credentials
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Ranjith (Read-Only Access)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
terraform output -json ranjith_credentials | jq -r '
  "Username: " + .username,
  "Password: " + .console_password,
  "Access Key: " + .access_key_id,
  "Secret Key: " + .secret_access_key,
  "Access Level: " + .access_level
'
echo ""

# Display Aasim credentials
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Aasim (Administrator)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
terraform output -json aasim_credentials | jq -r '
  "Username: " + .username,
  "Password: " + .console_password,
  "Access Key: " + .access_key_id,
  "Secret Key: " + .secret_access_key,
  "Access Level: " + .access_level
'
echo ""

# Display Suhas credentials
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Suhas (Administrator)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
terraform output -json suhas_credentials | jq -r '
  "Username: " + .username,
  "Password: " + .console_password,
  "Access Key: " + .access_key_id,
  "Secret Key: " + .secret_access_key,
  "Access Level: " + .access_level
'
echo ""

# Create individual credential files
echo "=========================================="
echo "  📄 Individual Credential Files"
echo "=========================================="

terraform output -json ranjith_credentials > ~/iam-credentials/ranjith-credentials.json
terraform output -json aasim_credentials > ~/iam-credentials/aasim-credentials.json
terraform output -json suhas_credentials > ~/iam-credentials/suhas-credentials.json

echo "Individual files saved:"
echo "  • ~/iam-credentials/ranjith-credentials.json"
echo "  • ~/iam-credentials/aasim-credentials.json"
echo "  • ~/iam-credentials/suhas-credentials.json"
echo ""

# Download instructions
echo "=========================================="
echo "  💾 Download Credentials to Your Computer"
echo "=========================================="
echo ""
echo "To download credentials from CloudShell:"
echo ""
echo "1. Click 'Actions' menu in CloudShell"
echo "2. Select 'Download file'"
echo "3. Enter path: ~/iam-credentials/ranjith-credentials.json"
echo "4. Repeat for aasim and suhas credentials"
echo ""
echo "Or download all at once:"
echo "  cd ~/iam-credentials && tar -czf credentials.tar.gz *.json"
echo "  Then download: ~/iam-credentials/credentials.tar.gz"
echo ""

# Cleanup
rm -f tfplan

# Next steps
echo "=========================================="
echo "  ✅ Deployment Complete!"
echo "=========================================="
echo ""
echo -e "${GREEN}Next Steps:${NC}"
echo ""
echo "1. ${YELLOW}Download credentials${NC} from CloudShell (see instructions above)"
echo "2. ${YELLOW}Distribute credentials${NC} securely to each team member"
echo "3. ${YELLOW}Test console login${NC} for each user"
echo "4. ${YELLOW}Enable MFA${NC} in IAM console for all users"
echo "5. ${YELLOW}Update Notion${NC}: Mark Task 1.1 as Complete ✅"
echo ""
echo -e "${BLUE}Console Login URL:${NC}"
echo "https://$ACCOUNT_ID.signin.aws.amazon.com/console"
echo ""
echo -e "${GREEN}🎉 All done! Your SRD Ecosystem team is ready to go!${NC}"
echo ""
