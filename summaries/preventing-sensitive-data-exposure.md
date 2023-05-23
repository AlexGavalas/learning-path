---
title: Secure Coding - Preventing Sensitive Data Exposure
created: '2023-05-22'
updated: '2023-05-24'
published: true
---

# Secure Coding - Preventing Sensitive Data Exposure

Lesson watched on Pluralsight ([link](https://app.pluralsight.com/library/courses/secure-coding-preventing-sensitive-data-exposure/table-of-contents)).

Data can be grouped into three categories.

Application data (eg. configuration, byproducts like logging data), user data (eg. personal identifying information) and data protecting data (eg. passwords and access control lists).

Not all data are considered sensitive, like generic user data, logging data that do not leak sensitive information. OWASP defines sensitive data as any data that can be used to identify a user, eg. name, address, financial information, username.

## Attack surface analysis

We need to identify points (attack vectors) of possible vulnerabilities.

In a web application there are two main attack vectors. Data in-transit, meaning the connections between the components (eg. HTTP endpoints), and data at rest, meaning files or software (eg. database files or the browser).

## Attacking the web application

Sensitive data can be either plaintext or encrypted.

### Data in-transit attack - Man-in-the-middle

The attacker could be either in the middle intercepting and forwarding traffic (has control), or sniffing the network for traffic (does not have control). One could do this by DNS spoofing or highjacking a wifi router.

TLS encrypts HTTP requests before the TCP layer. HTTP over TLS is commonly called _HTTPS_.

A basic step for the browser is to match the address the user navigates to with the subject of its certificate. It also makes sure the certificate is not expired and that it was issued by a trusted authority. When any of the certificate checks fail, the browser will inform the user that they may not communicate with the intended web application.

#### OWASP recommendations 🔒

-   Keep sensitive data out of the URL. Browsers keep the URL in their history
-   Use a `no-referrer` directive on linked resources
-   Have TLS everywhere
-   Use strong ciphers

## Attacking the web browser

### Certificates attack

"Which Directory?" problem is when the browser cannot find the next certificate in the chain.

#### OWASP recommendations 🔒

-   Public key pinning
-   Use a large key size (at least 2048 bits) to generate the certificate
-   Use multiple domain certificates
-   Be aware of wildcard certificates
-   Don't use self signed certificates

### Protocol downgrading attack

When an HTTPS application still sends some traffic over plain HTTP, it can expose any sensitive information (eg. session cookies).

The header `HTTP Strict-Transport-Security` (`HSTS`), indicates to the browser that it should never communicate over plain HTTP. This should be sent in at least one request over HTTPS and the certificate must be valid. Then the browser will try to upgrade any plain HTTP requests to HTTPS.

## Attacking data at rest

### Password attacks

-   Brute force attack: any possible variations are tried
-   Dictionary attack: any possible variations are tried, but are limited to specific words from the dictionary
-   Rainbow tables: attempting to match the hash before attempting to login

Brute force and dictionary are impractical, if a rate limit/restriction on failed attempts is in place. These attacks work on unsalted hashes.

### Salted hashes

Salting is to prepend or append a fixed length random value to the user password, and using the result as an input to the hashing function. Each credential should have a unique salt.

We can make the hashing function run as slow as possible to make it difficult for an attacker to perform a brute force attack.

#### OWASP recommendations 🔒

-   Recommended hash functions: Argon2, PBKDF2, Scrypt, Bcrypt, HMACs
-   Set a maximum length for passwords (eg. 160 characters), without limiting the character set
