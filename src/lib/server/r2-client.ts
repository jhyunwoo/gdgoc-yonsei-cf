/**
 * @file This file configures and exports a singleton S3 client for interacting with Cloudflare R2 storage.
 */

import { S3Client } from '@aws-sdk/client-s3'

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || 'dummy-account-id'
const accessKey = process.env.R2_ACCESS_KEY || 'dummy-access-key'
const secretKey = process.env.R2_SECRET_KEY || 'dummy-secret-key'

/**
 * An instance of the S3Client configured to connect to Cloudflare R2 storage.
 * This client is used for all R2-related operations, such as generating pre-signed URLs
 * for uploads or deleting objects from the bucket.
 * It is configured using credentials and account ID from environment variables.
 */
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
})

export default r2Client
