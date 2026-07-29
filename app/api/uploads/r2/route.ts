import crypto from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const maxMp3SourceBytes = 1024 * 1024 * 1024;
const maxSrtSourceBytes = 500 * 1024 * 1024;
const maxShareSourceBytes = 1024 * 1024 * 1024;
const uploadExpiresSeconds = 15 * 60;
const allowedVideoExtensions = [
  ".mp4",
  ".webm",
  ".mov",
  ".mkv",
  ".avi",
  ".mpeg",
  ".mpg",
];
const allowedVideoMimeTypes = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
  "video/mpeg",
  "application/octet-stream",
]);
const allowedSrtSourceExtensions = [
  ".mp3",
  ".wav",
  ".m4a",
  ".aac",
  ".ogg",
  ".opus",
  ".flac",
  ".mp4",
  ".webm",
  ".mov",
  ".mkv",
  ".avi",
  ".mpeg",
  ".mpg",
];
const allowedSrtSourceMimeTypes = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/aac",
  "audio/ogg",
  "audio/opus",
  "audio/flac",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
  "video/mpeg",
  "application/octet-stream",
]);

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function hmac(key: crypto.BinaryLike, value: string) {
  return crypto.createHmac("sha256", key).update(value).digest();
}

function encodePathSegment(value: string) {
  return encodeURIComponent(value).replace(/[!'()*]/g, (char) =>
    `%${char.charCodeAt(0).toString(16).toUpperCase()}`
  );
}

function encodeQueryValue(value: string) {
  return encodeURIComponent(value).replace(/[!'()*]/g, (char) =>
    `%${char.charCodeAt(0).toString(16).toUpperCase()}`
  );
}

function normalizeEndpoint(value: string) {
  return value.trim().replace(/\/+$/g, "");
}

function sanitizeFileName(value: unknown, fallback: string) {
  const fileName = String(value || fallback).trim() || fallback;
  return fileName.replace(/[^\w.\-]+/g, "-").replace(/-+/g, "-").slice(0, 120);
}

function getAllowedExtension(fileName: string, allowedExtensions: string[]) {
  const lowerName = fileName.toLowerCase();
  return allowedExtensions.find((extension) => lowerName.endsWith(extension));
}

function assertVideoSource(
  input: Record<string, unknown>,
  fallbackName: string,
  maxBytes: number,
  maxSizeLabel: string
) {
  const fileName = sanitizeFileName(input.fileName, fallbackName);
  const extension = getAllowedExtension(fileName, allowedVideoExtensions);
  const contentType = String(input.contentType || "").toLowerCase();
  const fileSize = Number(input.fileSize || 0);

  if (!extension) {
    throw new Error("Formato no permitido. Sube un archivo de video.");
  }

  if (!Number.isFinite(fileSize) || fileSize <= 0) {
    throw new Error("El archivo esta vacio.");
  }

  if (fileSize > maxBytes) {
    throw new Error(`El archivo supera el limite de ${maxSizeLabel}.`);
  }

  if (
    contentType &&
    !contentType.startsWith("video/") &&
    !allowedVideoMimeTypes.has(contentType)
  ) {
    throw new Error("Formato no permitido. Sube un archivo de video.");
  }

  return { fileName, extension: extension.slice(1), contentType, fileSize };
}

function assertMp3Source(input: Record<string, unknown>) {
  return assertVideoSource(input, "video.mp4", maxMp3SourceBytes, "1 GB");
}

function assertShareSource(input: Record<string, unknown>) {
  return assertVideoSource(input, "video.mp4", maxShareSourceBytes, "1 GB");
}

function assertSrtSource(input: Record<string, unknown>) {
  const fileName = sanitizeFileName(input.fileName, "audio.mp3");
  const extension = getAllowedExtension(fileName, allowedSrtSourceExtensions);
  const contentType = String(input.contentType || "").toLowerCase();
  const fileSize = Number(input.fileSize || 0);

  if (!extension) {
    throw new Error("Formato no permitido. Sube un archivo de audio o video.");
  }

  if (!Number.isFinite(fileSize) || fileSize <= 0) {
    throw new Error("El archivo esta vacio.");
  }

  if (fileSize > maxSrtSourceBytes) {
    throw new Error("El archivo supera el limite de 500 MB.");
  }

  if (
    contentType &&
    !contentType.startsWith("audio/") &&
    !contentType.startsWith("video/") &&
    !allowedSrtSourceMimeTypes.has(contentType)
  ) {
    throw new Error("Formato no permitido. Sube un archivo de audio o video.");
  }

  return { fileName, extension: extension.slice(1), contentType, fileSize };
}

function assertUploadSource(input: Record<string, unknown>) {
  if (input.service === "mp3") return assertMp3Source(input);
  if (input.service === "srt") return assertSrtSource(input);
  if (input.service === "share") return assertShareSource(input);
  throw new Error("Servicio de subida no permitido.");
}

function getRequiredEnv() {
  const endpoint = process.env.R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL;

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket || !publicBaseUrl) {
    throw new Error("Faltan variables R2 en el servidor.");
  }

  return {
    endpoint: normalizeEndpoint(endpoint),
    accessKeyId,
    secretAccessKey,
    bucket,
    publicBaseUrl: normalizeEndpoint(publicBaseUrl),
  };
}

function createPresignedPutUrl({
  endpoint,
  accessKeyId,
  secretAccessKey,
  bucket,
  key,
}: {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  key: string;
}) {
  const url = new URL(endpoint);
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const region = "auto";
  const service = "s3";
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const encodedKey = key.split("/").map(encodePathSegment).join("/");
  const canonicalUri = `/${encodePathSegment(bucket)}/${encodedKey}`;
  const signedHeaders = "host";
  const credential = `${accessKeyId}/${credentialScope}`;
  const queryParams = [
    ["X-Amz-Algorithm", "AWS4-HMAC-SHA256"],
    ["X-Amz-Credential", credential],
    ["X-Amz-Date", amzDate],
    ["X-Amz-Expires", String(uploadExpiresSeconds)],
    ["X-Amz-SignedHeaders", signedHeaders],
  ].sort(([a], [b]) => a.localeCompare(b));
  const canonicalQueryString = queryParams
    .map(([keyName, value]) => `${encodeQueryValue(keyName)}=${encodeQueryValue(value)}`)
    .join("&");
  const canonicalRequest = [
    "PUT",
    canonicalUri,
    canonicalQueryString,
    `host:${url.host}\n`,
    signedHeaders,
    "UNSIGNED-PAYLOAD",
  ].join("\n");
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256(canonicalRequest),
  ].join("\n");
  const signingKey = hmac(
    hmac(hmac(hmac(`AWS4${secretAccessKey}`, dateStamp), region), service),
    "aws4_request"
  );
  const signature = crypto
    .createHmac("sha256", signingKey)
    .update(stringToSign)
    .digest("hex");

  return `${endpoint}${canonicalUri}?${canonicalQueryString}&X-Amz-Signature=${signature}`;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  if (!body) {
    return jsonError("Solicitud invalida.");
  }

  let source;
  let env;

  try {
    source = assertUploadSource(body);
    env = getRequiredEnv();
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Solicitud invalida.", 400);
  }

  const service = body.service === "srt" ? "srt" : body.service === "share" ? "share" : "mp3";
  const uploadId = crypto.randomUUID();
  const objectKey = `${service}/uploads/${uploadId}/input.${source.extension}`;
  const uploadUrl = createPresignedPutUrl({
    endpoint: env.endpoint,
    accessKeyId: env.accessKeyId,
    secretAccessKey: env.secretAccessKey,
    bucket: env.bucket,
    key: objectKey,
  });

  return NextResponse.json({
    uploadUrl,
    objectKey,
    sourceKey: objectKey,
    sourceUrl: `${env.publicBaseUrl}/${objectKey}`,
    originalName: source.fileName,
    mimeType: source.contentType,
    fileSizeBytes: source.fileSize,
    expiresIn: uploadExpiresSeconds,
  });
}
