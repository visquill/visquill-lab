# Security Policy

## Scope

VisQuill GDK is a client-side graphics library that operates entirely in the browser. It does not handle authentication, network requests, user data, or server-side execution.

Security issues most likely to be relevant to this library include:

- DOM-based XSS through unsanitized input passed to SVG element attributes or text content
- Prototype pollution via malformed input to public API methods

## Reporting a Vulnerability

Please do not report security vulnerabilities through public GitHub issues.

Instead, send a description to **security@visquill.com** with the subject line `[SECURITY] visquill-gdk`. Include:

- A description of the issue and its potential impact
- Steps to reproduce or a minimal proof of concept
- The affected version(s)

## Supported Versions

Only the latest published version receives security fixes.