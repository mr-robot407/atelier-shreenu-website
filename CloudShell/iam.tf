terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Provider automatically uses CloudShell credentials
provider "aws" {
  region = var.aws_region
}

# Variables
variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "ap-south-1"  # Mumbai region
}

variable "project_name" {
  description = "Project name prefix"
  type        = string
  default     = "atelier-shreenu-srd"
}

# IAM Users
resource "aws_iam_user" "ranjith" {
  name = "ranjith"
  path = "/team/"
  
  tags = {
    Name        = "Ranjith"
    Role        = "Read-Only Access"
    Project     = var.project_name
    Environment = "production"
  }
}

resource "aws_iam_user" "aasim" {
  name = "aasim"
  path = "/team/"
  
  tags = {
    Name        = "Aasim"
    Role        = "Administrator"
    Project     = var.project_name
    Environment = "production"
  }
}

resource "aws_iam_user" "suhas" {
  name = "suhas"
  path = "/team/"
  
  tags = {
    Name        = "Suhas"
    Role        = "Administrator"
    Project     = var.project_name
    Environment = "production"
  }
}

# Console login profiles (passwords will be auto-generated)
resource "aws_iam_user_login_profile" "ranjith" {
  user                    = aws_iam_user.ranjith.name
  password_reset_required = true
}

resource "aws_iam_user_login_profile" "aasim" {
  user                    = aws_iam_user.aasim.name
  password_reset_required = true
}

resource "aws_iam_user_login_profile" "suhas" {
  user                    = aws_iam_user.suhas.name
  password_reset_required = true
}

# Access keys for programmatic access
resource "aws_iam_access_key" "ranjith" {
  user = aws_iam_user.ranjith.name
}

resource "aws_iam_access_key" "aasim" {
  user = aws_iam_user.aasim.name
}

resource "aws_iam_access_key" "suhas" {
  user = aws_iam_user.suhas.name
}

# Attach ReadOnlyAccess policy to Ranjith
resource "aws_iam_user_policy_attachment" "ranjith_readonly" {
  user       = aws_iam_user.ranjith.name
  policy_arn = "arn:aws:iam::aws:policy/ReadOnlyAccess"
}

# Attach AdministratorAccess policy to Aasim
resource "aws_iam_user_policy_attachment" "aasim_admin" {
  user       = aws_iam_user.aasim.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}

# Attach AdministratorAccess policy to Suhas
resource "aws_iam_user_policy_attachment" "suhas_admin" {
  user       = aws_iam_user.suhas.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}

# Custom policy for SRD Ecosystem services
resource "aws_iam_policy" "srd_ecosystem_policy" {
  name        = "${var.project_name}-ecosystem-policy"
  description = "Custom policy for SRD Digital Ecosystem services"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "DynamoDBAccess"
        Effect = "Allow"
        Action = [
          "dynamodb:*"
        ]
        Resource = "*"
      },
      {
        Sid    = "SESAccess"
        Effect = "Allow"
        Action = [
          "ses:*"
        ]
        Resource = "*"
      },
      {
        Sid    = "LexAccess"
        Effect = "Allow"
        Action = [
          "lex:*"
        ]
        Resource = "*"
      },
      {
        Sid    = "BedrockAccess"
        Effect = "Allow"
        Action = [
          "bedrock:*"
        ]
        Resource = "*"
      },
      {
        Sid    = "LambdaAccess"
        Effect = "Allow"
        Action = [
          "lambda:*"
        ]
        Resource = "*"
      },
      {
        Sid    = "EventBridgeAccess"
        Effect = "Allow"
        Action = [
          "events:*",
          "scheduler:*"
        ]
        Resource = "*"
      },
      {
        Sid    = "StepFunctionsAccess"
        Effect = "Allow"
        Action = [
          "states:*"
        ]
        Resource = "*"
      },
      {
        Sid    = "FargateAccess"
        Effect = "Allow"
        Action = [
          "ecs:*",
          "ecr:*"
        ]
        Resource = "*"
      },
      {
        Sid    = "APIGatewayAccess"
        Effect = "Allow"
        Action = [
          "apigateway:*"
        ]
        Resource = "*"
      },
      {
        Sid    = "CloudWatchAccess"
        Effect = "Allow"
        Action = [
          "logs:*",
          "cloudwatch:*"
        ]
        Resource = "*"
      },
      {
        Sid    = "IAMAccess"
        Effect = "Allow"
        Action = [
          "iam:GetRole",
          "iam:PassRole",
          "iam:CreateRole",
          "iam:AttachRolePolicy"
        ]
        Resource = "*"
      }
    ]
  })
}

# Get current AWS account info (CloudShell auto-provides this)
data "aws_caller_identity" "current" {}

# Outputs
output "account_id" {
  description = "AWS Account ID"
  value       = data.aws_caller_identity.current.account_id
}

output "console_login_url" {
  description = "AWS Console login URL"
  value       = "https://${data.aws_caller_identity.current.account_id}.signin.aws.amazon.com/console"
}

output "ranjith_credentials" {
  description = "Credentials for Ranjith"
  value = {
    username           = aws_iam_user.ranjith.name
    access_key_id      = aws_iam_access_key.ranjith.id
    secret_access_key  = aws_iam_access_key.ranjith.secret
    console_password   = aws_iam_user_login_profile.ranjith.password
    access_level       = "ReadOnlyAccess"
  }
  sensitive = true
}

output "aasim_credentials" {
  description = "Credentials for Aasim"
  value = {
    username           = aws_iam_user.aasim.name
    access_key_id      = aws_iam_access_key.aasim.id
    secret_access_key  = aws_iam_access_key.aasim.secret
    console_password   = aws_iam_user_login_profile.aasim.password
    access_level       = "AdministratorAccess"
  }
  sensitive = true
}

output "suhas_credentials" {
  description = "Credentials for Suhas"
  value = {
    username           = aws_iam_user.suhas.name
    access_key_id      = aws_iam_access_key.suhas.id
    secret_access_key  = aws_iam_access_key.suhas.secret
    console_password   = aws_iam_user_login_profile.suhas.password
    access_level       = "AdministratorAccess"
  }
  sensitive = true
}

output "user_summary" {
  description = "Summary of created IAM users"
  value = {
    ranjith = {
      username = aws_iam_user.ranjith.name
      arn      = aws_iam_user.ranjith.arn
      access   = "ReadOnlyAccess"
    }
    aasim = {
      username = aws_iam_user.aasim.name
      arn      = aws_iam_user.aasim.arn
      access   = "AdministratorAccess"
    }
    suhas = {
      username = aws_iam_user.suhas.name
      arn      = aws_iam_user.suhas.arn
      access   = "AdministratorAccess"
    }
  }
}
