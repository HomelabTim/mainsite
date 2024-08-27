---
title: "Deploying Passbolt for a Small Business"
description: "Discover how Timothy Smith successfully deployed Passbolt, a self-hosted, open-source password manager, using Docker to enhance security and efficiency. This blog post provides a step-by-step guide on setting up Passbolt on a Docker environment, including details on system requirements, Docker installation, configuration tweaks, and securing the service with HTTPS. Learn from my experience to implement a robust password management system for your team."
categories: ["AIMG Projects", "Networking and Servers", "Software and Tools", "Virtualization"]
date: 2024-05-01
draft: false
showauthor: false
authors:
  - timothysmith
---
# Introduction

At AI Media Group, managing sensitive data securely is paramount. As our team grew, so did the complexity of managing passwords and credentials across various platforms and services. The solution? Implementing Passbolt, a self-hosted, open-source password manager tailored specifically for teams. In this post, I'll walk you through how we successfully deployed Passbolt using Docker, highlighting the benefits and learning curves we encountered along the way.

## Why Passbolt?

Before diving into the technical details, it's essential to understand why we chose Passbolt over other password management solutions. Our primary criteria were security, ease of use, and scalability. Passbolt stood out due to its open-source nature, offering transparency and robust security features. It is designed for teams, making it easy to share credentials securely within our organization. Moreover, being self-hosted, it provided us full control over our data.

## Preparing for Deployment

### Passbolt Documentation

Passbolt offers versatile deployment options suitable for various hosting preferences. Users can choose to self-host on a home server or within an on-premise infrastructure in a small business, or opt for cloud deployment hosted by Passbolt for ease and convenience. The platform features a free tier for self-hosting as well as [paid tiers](https://www.passbolt.com/pricing/pro) for enhanced services and managed hosting. To facilitate setup and troubleshooting, Passbolt provides comprehensive [documentation](https://www.passbolt.com/docs/), ensuring users can get up and running smoothly regardless of the chosen deployment method.

{{< button href="https://www.passbolt.com/" target="" >}}
Visit Passbolt's Website
{{< /button >}}

### System Requirements

We opted to deploy Passbolt on a virtual server running Debian 12. Here are the minimum requirements we ensured we had much more before starting:

- A server with Debian 12
- 2 cores from CPU `we used 8`
- 2GB of RAM `we used 16GB`
- 20GB of hard drive storage `we used 500GB`
- Docker and Docker Compose installed

## Installation of Docker and Docker Compose

Firstly, we needed Docker and Docker Compose on our server. Docker simplifies deployment by containerizing the application and its environment.

**Before installing Docker we need to update the server**
```bash
sudo apt update && sudo apt upgrade -y
```
**Install Docker and Dock
er-Compose**
```bash
sudo apt install docker.io docker-compose -y
```
**To confirm docker is installed run:**
```bash
docker --version
```

For more information on Docker and the work I have done with it view my [Docker Project](https://portfolio.homelabtim.com/projects/docker)

## Deploying Passbolt

With Docker ready, deploying Passbolt was straightforward. We used the `wget` command to retrieve the `docker-compose-ce.yml` file from the [docs](https://www.passbolt.com/docs/hosting/install/ce/docker/):

**Make a new directory just for passbolt**
```bash
sudo mkdir passbolt
cd passbolt
```
**Add the files to the new directory called `passbolt`**
```bash
wget https://download.passbolt.com/ce/docker/docker-compose-ce.yaml
wget https://github.com/passbolt/passbolt_docker/releases/latest/download/docker-compose-ce-SHA512SUM.txt
```
**Ensure the file has not been corrupted by verifying its shasum**
```bash
sha512sum -c docker-compose-ce-SHA512SUM.txt
```
The output should then be something similar to this: `docker-compose-ce.yaml: OK`

### Change Variables in yaml file

**Original `docker-compose-ce.yaml` file:**
```yaml
version: "3.9"
services:
  db:
    image: mariadb:10.11
    restart: unless-stopped
    environment:
      MYSQL_RANDOM_ROOT_PASSWORD: "true"
      MYSQL_DATABASE: "passbolt"
      MYSQL_USER: "passbolt"
      MYSQL_PASSWORD: "P4ssb0lt"
    volumes:
      - database_volume:/var/lib/mysql

  passbolt:
    image: passbolt/passbolt:latest-ce
    #Alternatively you can use rootless:
    #image: passbolt/passbolt:latest-ce-non-root
    restart: unless-stopped
    depends_on:
      - db
    environment:
      APP_FULL_BASE_URL: https://passbolt.local
      DATASOURCES_DEFAULT_HOST: "db"
      DATASOURCES_DEFAULT_USERNAME: "passbolt"
      DATASOURCES_DEFAULT_PASSWORD: "P4ssb0lt"
      DATASOURCES_DEFAULT_DATABASE: "passbolt"
    volumes:
      - gpg_volume:/etc/passbolt/gpg
      - jwt_volume:/etc/passbolt/jwt
    command:
      [
        "/usr/bin/wait-for.sh",
        "-t",
        "0",
        "db:3306",
        "--",
        "/docker-entrypoint.sh",
      ]
    ports:
      - 80:80
      - 443:443
    #Alternatively for non-root images:
    # - 80:8080
    # - 443:4433

volumes:
  database_volume:
  gpg_volume:
  jwt_volume:
```

| Variable                       | What to Change                                                                                                    |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `restart`                      | **Change this variable in `db` from `unless-stopped` to `always` this insures if crashed it will restart**        |
| `MYSQL_USER`                   |  **Create a username of your choice**                                                                             |
| `MYSQL_PASSWORD`               | **This is where you will input a password of your choice**                                                        |
| `restart`                      | **Change this variable in `passbolt` from `unless-stopped` to `always` this insures if crashed it will restart**  |
| `APP_FULL_BASE_URL`            | **Change this to your domain you will access this under**                                                         |
| `DATASOURCES_DEFAULT_USERNAME` | **Create a username of your choice**                                                                              |
| `DATASOURCES_DEFAULT_PASSWORD` | **This is where you will input a password of your choice**                                                        |


{{< alert icon="triangle-exclamation" cardColor="#e63946" iconColor="#1d3557" textColor="#f1faee" >}}
**WARNING** before moving on to the next steps you will need to change the file name from `docker-compose-ce.yaml` to `docker-compose.yaml`
{{< /alert >}}

**To change the filename simply rename it using `mv`:**
```bash
sudo mv docker-compose-ce.yaml docker-compose.yaml
```

## Launching Passbolt

After configuring `docker-compose.yml`, starting Passbolt was as simple as running:
```bash
docker-compose up -d
```
{{< alert "lightbulb" >}}
**TIP** remember to set the IP of your server to your Domain you can find your IP address using the command `ip add`
{{< /alert >}}

Once running, we can confirm it is accessible through the browser at the specified URL we set.

### Post-Deployment Configuration

Now that Passbolt is up and running they ask you setup a **SMTP email server** for user registration and notifications. This setup is crucial as it handles all outgoing communications from Passbolt to its users, including registration links and notification alerts.

If you're not ready to set up an **SMTP server** just yet, or if you prefer a more hands-on method, adding users via the command line is a great alternative. This method is particularly useful during initial setup phases or when managing a small number of users. Here's how to do it:

**Add your first user this is the account you will access passbolt on**

```bash
docker exec -it passbolt_passbolt_1 su -m -c "/usr/share/php/passbolt/bin/cake passbolt register_user -u EMAIL -f FIRST NAME -l LAST NAME -r admin" -s /bin/sh www-data
```
| Variable               | What to Change                                                                         |
| ---------------------- | -------------------------------------------------------------------------------------- |
| `passbolt_passbolt_1`  | **This is the name of your docker container only change this if yours is different**   |
| `EMAIL`                |  **Change this to reflect the users email address**                                    |
| `FIRST NAME`           | **Change this to reflect the users first name**                                        |
| `LAST NAME`            | **Change this to reflect the users last name**                                         |
| `-r admin`             | **Add or remove this depending on if you want the user to have admin permissions**     |

{{< alert "lightbulb" >}}
**TIP** use this same method to add multiple users to the passbolt account once the account is made copy the link in the terminal and send it to the user so they can setup their account
{{< /alert >}}

# Conclusion

Deploying Passbolt has significantly improved our team’s ability to manage passwords securely and efficiently. The process was a learning curve, especially tweaking the configurations for optimal performance. Looking forward, we plan to explore more of Passbolt's features, such as user groups and permissions, to further tailor the tool to our needs.

In conclusion, Passbolt has proven to be a robust solution for team-based password management. Deploying it using Docker streamlined the process, making it manageable and scalable. We recommend Passbolt to any team looking for a secure, self-hosted password management solution.