---
title: "Mastering Systemd"
description: "Automating Commands at Boot with systemd.service"
categories: ["AIMG Projects", "File Systems", "Networking and Servers", "Virtualization"]
date: 2024-01-13
draft: false
showauthor: false
authors:
  - timothysmith
---

# Introduction

In the realm of Linux system administration, understanding systemd is a crucial skill. In this blog post, we'll explore the process of setting up a systemd.service to automate commands at boot. Using practical examples and insights, we'll demystify the systemd landscape and showcase how it can be harnessed to streamline tasks. Let's dive in!

## Understanding systemd.service

The journey begins in the main directory where systemd.service files reside. **Navigate to this directory using the following command:**

```bash
cd /etc/systemd/system/
```
{{< alert >}}
As a helpful tip, it's recommended to name your service files in the format `name.service` to maintain clarity and organization.
{{< /alert >}}

**Example of a `systemd.service` file `worker1.service`:**

```ini
[Unit]
Description=worker1
#After=network.target
After=network-online.target
Requires=network-online.target

[Service]
Type=simple
ExecStart=sh -c '/home/user/worker1.sh'
#Restart=on-failure
User=user

[Install]
WantedBy=multi-user.target
```

**Breaking down the service file:**

- The `[Unit]` section describes the unit and specifies dependencies, ensuring the service starts after the network is online.
- The `[Service]` section defines the type of service, the command to execute `ExecStart`, and the user under which the service runs.
- The `[Install]` section dictates where the service should be enabled.

**Example of `worker1.sh` script:**

```bash
#!/bin/bash

cd /path/in/first/server

rsync -rdtv --size-only --delete rsync://0.0.0.0:873/path/in/second/server /path/in/first/server

cd /path/in/first/server

pwd
```
{{< alert >}}
**Change 0.0.0.0 to your server IP**
{{< /alert >}}

## Breaking down the `worker1.sh` script:

The script performs tasks like syncing two servers using rsync, changing directories, printing the current working directory.

**To learn more about `rsync` and what I have done with it view my article here:**

{{< button href="" target="" >}}
Rsync Article
{{< /button >}}

## Learning through Practical Implementation: 

Setting up a `systemd.service` to auto-run commands at boot offers several benefits:

1. `Reliability:` systemd ensures that the specified commands run reliably during the boot process, enhancing system stability.
2. `Orderly Execution:` Dependencies and targets in the service file ensure that commands execute in the desired order, preventing issues related to resource availability.
3. `User Specification:` The service runs with defined user permissions, promoting security and control over the execution environment.
4. `Automation:` Once configured, the systemd.service automates the execution of commands, reducing manual intervention and saving time.

# Conclusion: 

Mastering systemd opens up a realm of possibilities for system administrators. The ability to create and configure `systemd.services` empowers us to automate tasks effectively. As we've seen with the example of setting up `worker1`, the combination of systemd and well-crafted scripts provides a robust framework for automating commands at boot, making system management a more efficient and organized process.
