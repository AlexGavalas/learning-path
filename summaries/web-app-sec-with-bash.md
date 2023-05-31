---
title: Web application security with bash
created: '2023-05-20'
updated: '2023-06-01'
published: true
---

# Scan web applications with bash

Lesson watched on Pluralsight ([link](https://app.pluralsight.com/library/courses/bash-scan-web-applications/table-of-contents)).

portscan -> pages -> directories -> vulnerabilities

## Discovery

common ports: 80, 443, 8080, 8443

> Check metasploitable vm (target practice)

### Scan ips

curl with range ips eg:

```bash
curl http://192.168.2.[1-50]
```

```bash
curl -w 'Success: %{remote_IP}\n' -o output -s http://...
```

or with nmap with network range:

```bash
nmap 192.168.2.0/24
```

### Scan ports

```bash
curl -w 'Success: %{remote_port}\n' -s http://192.168.2.41:[1-1024]
```

or port scan with nmap

```bash
nmap 192.168.2.41
```

scan with nmap for specific ports:

```bash
nmap -p 80,443 192.168.2.41
```

full port scan:

```bash
nmap -p- 192.168.2.41
```

nmap with aggressive mode "-A" flag. Send packets to each open server and tries to analyze the response.

## Enumeration

Pages, files, directories, parameters

-   Crawling: Simulates user exploration automatically. Stealthy and quick but can miss hidden content (eg. a page that is not linked)

Visit every link and download everything:

```bash
wget --recursive http://..
```

-   Brute forcing: Tests common filenames and parameters. Can discover hidden content but is noisy and slow. Important to have a good wordlist. Eg. https://github.com/danielmiessler/seclists

Eg.

```bash
for word in $wordlist; do wget http://site.com/$word; done;
```

For parameter brute force, we can use the ffuf tool (https://github.com/ffuf/ffuf)

## Vulnerability discovery

Web server vulnerabilities relate to the web server (eg. Apache) and are usually misconfigurations or lack of patching.

Web application vulnerabilities are on the web application implementation (eg. SQL injections)

Find vulnerabilities with nmap. Perform all the enumerations and run all the scripts related. This might take some time.

```bash
nmap -p 80,443 -A --script=http\* http://..
```

or the same with nikto (https://github.com/sullo/nikto). This might also take some time.

```bash
nikto -h http://...
```

### Automating everything

```bash
#!/bin/bash

echo "-- Web application enumeration --";

## Test if the script is being executed as root
if [[ "$EUID" -ne 0 ]]; then
	echo "Please run as root";
	exit;
fi

# Test if target is provided
if [[ $1 ]]; then
	target=$1;
	domain=$(echo $target | cut -d '/' -f 3);
	echo "Target: $target";
	echo "Domain: $domain";
else
	echo "Target not provided";
	exit;
fi

mkdir $domain;
cd ./$domain;

# Crawl the web application
wget --recursive $target

# Bruteforcing files/directories
# Check dirb is installed
dirb $target /usr/share/wordlists/dirb/small.txt -o dirb-scan.txt

# Use NMAP to discover vulnerabilites
nmap -p 80,443 -A --script=http* $domain -oN nmap-scan.txt

# Run nikto to enumerate vulnerabilities
# Check nikto is installed
nikto -o nikto-scan.txt -h $target

echo "-- Enumeration complete! --"
```
