---
title: 'TLS for local development'
author: 'Pete Hampton'
author_link: 'https://github.com/pjhampton'
date: '2022-Jun-21'
show_post_footer: true
excerpt: >
  
---

I recently got a bug report that some code I maintain and ship stopped working with TLS. 
When a user enabled SSL, the functionality ceased to work. 
I immediately knew the cause - I swapped out HTTP clients to conform to the upstream branch and both clients approach TLS configuration slightly differently. This was a bummer, but I knew to fix that I needed to do 2 things: 

  - Set up TLS locally so I didn't have to build a production build of the software (which takes a long time)
  - Add a test to ensure that the software can work on both HTTP and HTTPS (not covered here).

This was the first time I encountered a bug exclusive to HTTPS. 
I think when many programmers develop locally (like me) they tend to develop over non-encrypted channels.
This post is a quick walk though of setting up TLS to work locally.

## Setting Up

I used [mkcert](https://github.com/FiloSottile/mkcert) to set up a local certificate authority locally and generate the certs:

```sh
$ brew install mkcert

$ mkcert -install

$ mkcert localhost.com localhost 127.0.0.1 ::1
Note: the local CA is not installed in the Firefox trust store.
Run "mkcert -install" for certificates to be trusted automatically ⚠️

Created a new certificate valid for the following names 📜
 - "localhost.com"
 - "localhost"
 - "127.0.0.1"
 - "::1"

The certificate is at "./localhost.com+3.pem" and the key at "./localhost.com+3-key.pem" ✅

It will expire on 21 September 2024 🗓
```

## Configuration for PEM

In this instance, I was developing in the Kibana codebase so setting up was as easy as follows.

```yml
# =================== System: Kibana Server (Optional) ===================
# Enables SSL and paths to the PEM-format SSL certificate and SSL key files, respectively.
# These settings enable SSL for outgoing requests from the Kibana server to the browser.
server.ssl.enabled: true
server.ssl.certificate: /Users/ph/workspace/kibana/localhost.com+3.pem
server.ssl.key: /Users/ph/workspace/kibana/localhost.com+3-key.pem
```

Then starting the server, followed by a cURL command. 


```sh
$ yarn start --no-base-path

yarn run v1.22.5
$ node scripts/kibana --dev --no-base-path
Marking config path as handled: dev
Marking config path as handled: plugins
Marking config path as handled: server
 no-base-path  ====================================================================================================
 no-base-path  Running Kibana in dev mode with --no-base-path disables several useful features and is not recommended
 no-base-path  ====================================================================================================
... and so on

$ curl -v https://elastic:changeme@localhost:5601/api/status
*   Trying 127.0.0.1:5601...
* Connected to localhost (127.0.0.1) port 5601 (#0)
* ALPN, offering h2
* ALPN, offering http/1.1
* successfully set certificate verify locations:
*  CAfile: /etc/ssl/cert.pem
*  CApath: none
* (304) (OUT), TLS handshake, Client hello (1):
* (304) (IN), TLS handshake, Server hello (2):
* (304) (IN), TLS handshake, Unknown (8):
* (304) (IN), TLS handshake, Certificate (11):
* (304) (IN), TLS handshake, CERT verify (15):
* (304) (IN), TLS handshake, Finished (20):
* (304) (OUT), TLS handshake, Finished (20):
* SSL connection using TLSv1.3 / AEAD-AES256-GCM-SHA384
* ALPN, server accepted to use http/1.1
* Server certificate:
*  subject: O=mkcert development certificate; OU=ph@Petes-MacBook-Pro.local (Pete Hampton)
*  start date: Jun 15 13:42:27 2022 GMT
*  expire date: Sep 15 13:42:27 2024 GMT
*  subjectAltName: host "localhost" matched cert's "localhost"
*  issuer: O=mkcert development CA; OU=ph@Petes-MacBook-Pro.local (Pete Hampton); CN=mkcert ph@Petes-MacBook-Pro.local (Pete Hampton)
*  SSL certificate verify ok.
* Server auth using Basic with user 'elastic'
> GET /api/status HTTP/1.1
> Host: localhost:5601
> Authorization: Basic ZWxhc3RpYzpjaGFuZ2VtZQ==
> User-Agent: curl/7.79.1
> Accept: */*
> 
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< x-content-type-options: nosniff
< referrer-policy: no-referrer-when-downgrade
< kbn-name: Petes-MacBook-Pro.local
< kbn-license-sig: add94f6b5313cb09f2ab8dacfb1bfa8319c6f762cbb50945a37584ab6de9cd33
< content-type: application/json; charset=utf-8
< cache-control: private, no-cache, no-store, must-revalidate
< content-length: 13341
< vary: accept-encoding
< accept-ranges: bytes
< Date: Tue, 21 Jun 2022 10:50:03 GMT
< Connection: keep-alive
< Keep-Alive: timeout=120
< 
<< RETURN PAYLOAD OMITTED >>        
```

## Configuration for JKS

It's the same case for most web server backed applications. 
For example, the Java framework Spring Boot can be set up just as easily:

```sh
➜ mkcert -pkcs12 localhost
Note: the local CA is not installed in the Firefox trust store.
Run "mkcert -install" for certificates to be trusted automatically ⚠️

Created a new certificate valid for the following names 📜
 - "localhost"

The PKCS#12 bundle is at "./localhost.p12" ✅

The legacy PKCS#12 encryption password is the often hardcoded default "changeit" ℹ️

It will expire on 21 September 2024 🗓
```

and in the application.properties file, and the .p12 file added to the resources directory:

```yml
server.ssl.key-store=classpath:localhost.p12
server.ssl.key-store-type=PKCS12
server.ssl.key-store-password=changeit
```

Things are slighly different here due to JKS (Java KeyStore). 
Although there are a couple of ways around this, exporting the certs to PKCS #12 format are the fastest way to get it working.
I may write more about this in the future. 

```sh
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v2.7.0)

2022-06-21 11:47:13.137  INFO 21868 --- [           main] c.p.localtls.LocalTlsApplication         : Starting LocalTlsApplication using Java 11.0.11 on Petes-MacBook-Pro.local with PID 21868 (/Users/ph/Downloads/local-tls/build/classes/java/main started by ph in /Users/ph/Downloads/local-tls)
2022-06-21 11:47:13.140  INFO 21868 --- [           main] c.p.localtls.LocalTlsApplication         : No active profile set, falling back to 1 default profile: "default"
2022-06-21 11:47:13.941  INFO 21868 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (https)
2022-06-21 11:47:13.948  INFO 21868 --- [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2022-06-21 11:47:13.948  INFO 21868 --- [           main] org.apache.catalina.core.StandardEngine  : Starting Servlet engine: [Apache Tomcat/9.0.63]
2022-06-21 11:47:14.027  INFO 21868 --- [           main] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2022-06-21 11:47:14.028  INFO 21868 --- [           main] w.s.c.ServletWebServerApplicationContext : Root WebApplicationContext: initialization completed in 840 ms
2022-06-21 11:47:14.604  INFO 21868 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (https) with context path ''
2022-06-21 11:47:14.616  INFO 21868 --- [           main] c.p.localtls.LocalTlsApplication         : Started LocalTlsApplication in 2.001 seconds (JVM running for 2.343)
2022-06-21 11:51:54.711  INFO 21868 --- [nio-8080-exec-4] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring DispatcherServlet 'dispatcherServlet'
2022-06-21 11:51:54.711  INFO 21868 --- [nio-8080-exec-4] o.s.web.servlet.DispatcherServlet        : Initializing Servlet 'dispatcherServlet'
2022-06-21 11:51:54.712  INFO 21868 --- [nio-8080-exec-4] o.s.web.servlet.DispatcherServlet        : Completed initialization in 1 ms

$ curl -v https://localhost:8080/                       
*   Trying 127.0.0.1:8080...
* Connected to localhost (127.0.0.1) port 8080 (#0)
* ALPN, offering h2
* ALPN, offering http/1.1
* successfully set certificate verify locations:
*  CAfile: /etc/ssl/cert.pem
*  CApath: none
* (304) (OUT), TLS handshake, Client hello (1):
* (304) (IN), TLS handshake, Server hello (2):
* (304) (IN), TLS handshake, Unknown (8):
* (304) (IN), TLS handshake, Certificate (11):
* (304) (IN), TLS handshake, CERT verify (15):
* (304) (IN), TLS handshake, Finished (20):
* (304) (OUT), TLS handshake, Finished (20):
* SSL connection using TLSv1.3 / AEAD-AES256-GCM-SHA384
* ALPN, server did not agree to a protocol
* Server certificate:
*  subject: O=mkcert development certificate; OU=ph@Petes-MacBook-Pro.local (Pete Hampton); CN=localhost
*  start date: Jun 21 10:39:17 2022 GMT
*  expire date: Sep 21 10:39:17 2024 GMT
*  subjectAltName: host "localhost" matched cert's "localhost"
*  issuer: O=mkcert development CA; OU=ph@Petes-MacBook-Pro.local (Pete Hampton); CN=mkcert ph@Petes-MacBook-Pro.local (Pete Hampton)
*  SSL certificate verify ok.
> GET / HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.79.1
> Accept: */*
> 
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 
< Content-Type: text/plain;charset=UTF-8
< Content-Length: 13
< Date: Tue, 21 Jun 2022 10:51:54 GMT
< 
* Connection #0 to host localhost left intact
Howdy, World!%   
```
