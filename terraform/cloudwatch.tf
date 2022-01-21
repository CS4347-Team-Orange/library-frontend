// Canary Common
resource "aws_s3_bucket" "canaries" { 
    bucket = "${local.app_name}-canaries"
    acl    = "private"

    versioning { 
        enabled = true
    }

    lifecycle_rule {
    enabled = true

    noncurrent_version_expiration {
      days = 60
    }
  }
}



resource "aws_s3_bucket_policy" "canaries_bucket_policy" {
  bucket = aws_s3_bucket.canaries.id
  policy = jsonencode({
    Version = "2012-10-17"
    Id = "CanaryBucketPolicy"
    Statement = [
      {
        Sid = "Permissions"
        Effect = "Allow"
        Principal = {
          AWS = data.aws_caller_identity.current.account_id
        }
        Action = ["s3:*"]
        Resource = ["${aws_s3_bucket.canaries.arn}/*"]
      }
    ]
  })
}

data "aws_iam_policy_document" "canary_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]
    effect = "Allow"

    principals {
      identifiers = ["lambda.amazonaws.com"]
      type = "Service"
    }
  }
}


data "aws_iam_policy_document" "canary_policy" {
  statement {
    sid = "Canary"
    effect = "Allow"
    actions = [
      "s3:PutObject",
      "s3:GetBucketLocation",
      "s3:ListAllMyBuckets",
      "cloudwatch:PutMetricData",
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "events:*"
    ]
    resources = ["*"]
  }
}


resource "aws_iam_policy" "canary_policy" {
  name = "${local.app_name}-canary-policy"
  path = "/"
  policy = data.aws_iam_policy_document.canary_policy.json
  description = "IAM role for AWS Synthetic Monitoring Canaries"
}

resource "aws_iam_role" "canary_role" {
  name = "${local.app_name}-canary-role"
  path = "/"
  assume_role_policy = data.aws_iam_policy_document.canary_assume_role_policy.json
  description = "IAM role for AWS Synthetic Monitoring Canaries"
}

resource "aws_iam_role_policy_attachment" "canary-policy-attachment" {
  role = aws_iam_role.canary_role.name
  policy_arn = aws_iam_policy.canary_policy.arn
}

// Canary: index


resource "local_file" "canary_index_inline" {
    content  = templatefile("${path.module}/canary_node.tpl", {
      protocol = "http",
      hostname = nonsensitive(data.tfe_outputs.backend.values.lb_dns),
      port = "80",
      path = ""
    })
    filename = "${path.module}/pageLoadBlueprint-index.js"
}

data "local_file" "canary_index_inline" { 
    depends_on = [ local_file.canary_index_inline ]
    filename = "${path.module}/pageLoadBlueprint-index.js"
}

data "archive_file" "canary_index_inline" {
  type        = "zip"
  output_path = "/tmp/canary_index_inline.zip"
  
  source {
    content = "${data.local_file.canary_index_inline.content}"
    filename = "nodejs/node_modules/pageLoadBlueprint.js"
  }
}


resource "aws_synthetics_canary" "index" {
  depends_on           = [ data.archive_file.canary_index_inline ]
  name                 = "library-${var.stage}-ix"
  artifact_s3_location = "s3://${aws_s3_bucket.canaries.id}/canary/index"
  execution_role_arn   = aws_iam_role.canary_role.arn
  handler              = "pageLoadBlueprint.handler"
  zip_file             = "/tmp/canary_index_inline.zip"
  runtime_version      = "syn-nodejs-puppeteer-3.3"
  start_canary         = true

  success_retention_period = 2
  failure_retention_period = 14

  schedule {
    expression = "rate(5 minutes)"
  }
    
  run_config {
    timeout_in_seconds = 300
    active_tracing = false
  }
}

resource "aws_cloudwatch_event_rule" "canary_event_rule_index" {
  name = "library-${var.stage}-index"
  event_pattern = jsonencode({
    source = ["aws.synthetics"]
    detail = {
      "canary-name": [aws_synthetics_canary.index.name],
      "test-run-status": ["FAILED"]
    }
  })
}

resource "aws_cloudwatch_event_target" "canary_event_target_index" {
  target_id = "${local.app_name}-index-target"
  arn = nonsensitive(data.tfe_outputs.account.values.sns_alerts_arn)
  rule = aws_cloudwatch_event_rule.canary_event_rule_index.name
}


// Cloudwatch dashboard

resource "aws_cloudwatch_dashboard" "dashboard" {
  dashboard_name = local.app_name

  dashboard_body = templatefile("cloudwatch_dash.tpl", {
      "cluster_name" = nonsensitive(data.tfe_outputs.account.values.ecs_cluster_name),
      "service_name" = local.app_name,
      "stage"        = var.stage,
      "region"       = data.aws_region.current.name,
      "ram_high"     = floor(local.service_ram * 0.9),
      "cpu_high"     = floor(local.service_cpu * 0.9),
      "target_group" = split(":", aws_lb_target_group.this.arn)[5],
      "load_balancer" = join("/", tolist(slice(tolist(split("/", nonsensitive(data.tfe_outputs.backend.values.lb_arn))), 1, 4)))
  })
}

// Cloudwatch alarms