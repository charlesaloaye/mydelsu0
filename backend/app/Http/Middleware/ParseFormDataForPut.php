<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ParseFormDataForPut
{
    /**
     * Handle an incoming request.
     *
     * Parse FormData for PUT/PATCH requests since Laravel doesn't do it automatically
     * This is needed because browsers send FormData with PUT requests but PHP's $_POST
     * only populates for POST requests
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only process PUT/PATCH requests
        if (in_array($request->method(), ['PUT', 'PATCH'])) {
            $contentType = $request->header('Content-Type');

            // Check if it's multipart/form-data (FormData)
            if ($contentType && strpos($contentType, 'multipart/form-data') !== false) {
                // Parse the raw input stream
                $rawData = file_get_contents('php://input');

                if (!empty($rawData)) {
                    // Extract boundary
                    preg_match('/boundary=(.*)$/is', $contentType, $matches);
                    $boundary = $matches[1] ?? null;

                    if ($boundary) {
                        $boundary = trim($boundary, '"');
                        $parsed = $this->parseMultipart($rawData, $boundary);

                        // Merge parsed data into request
                        if (!empty($parsed)) {
                            // Handle array notation like tags[0], images[0] etc
                            $processed = [];
                            foreach ($parsed as $key => $value) {
                                // Handle array notation like tags[0]
                                if (preg_match('/(\w+)\[(\d+)\]/', $key, $match)) {
                                    $fieldName = $match[1];
                                    $index = (int)$match[2];
                                    if (!isset($processed[$fieldName]) || !is_array($processed[$fieldName])) {
                                        $processed[$fieldName] = [];
                                    }
                                    $processed[$fieldName][$index] = $value;
                                } else {
                                    $processed[$key] = $value;
                                }
                            }

                            // Merge into request
                            $request->merge($processed);
                        }
                    }
                }
            }
        }

        return $next($request);
    }

    /**
     * Parse multipart/form-data
     */
    private function parseMultipart($data, $boundary)
    {
        $result = [];
        $parts = explode('--' . $boundary, $data);

        foreach ($parts as $part) {
            // Skip empty parts
            $part = trim($part);
            if (empty($part) || $part === '--') {
                continue;
            }

            // Split headers and body
            $headerEnd = strpos($part, "\r\n\r\n");
            if ($headerEnd === false) {
                $headerEnd = strpos($part, "\n\n");
            }

            if ($headerEnd === false) {
                continue;
            }

            $headers = substr($part, 0, $headerEnd);
            $body = substr($part, $headerEnd + 4);

            // Remove trailing boundary markers
            $body = rtrim($body, "\r\n--");

            // Extract field name from Content-Disposition header
            if (preg_match('/Content-Disposition:.*name="([^"]+)"/i', $headers, $matches)) {
                $fieldName = $matches[1];

                // Only process non-file fields (file fields have filename parameter)
                if (!preg_match('/filename=/i', $headers)) {
                    $result[$fieldName] = trim($body);
                }
            }
        }

        return $result;
    }
}
