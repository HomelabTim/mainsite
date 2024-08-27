---
title: "Mastering Automation with Ansible"
description: "A Journey at AI Media Group"
categories: ["AIMG Projects", "Personal Projects", "Automation"]
date: 2023-12-04
draft: false
showauthor: false
authors:
  - timothysmith
---
# Introduction

In the realm of IT automation, Ansible stands out as a powerful tool for simplifying configuration management, deployment, and task automation. My journey with Ansible began at **AI Media Group (AIMG)**, where I explored its capabilities and leveraged it to streamline various automation tasks. In this blog post, I'll share insights gained from working with Ansible, covering everything from installation and playbook creation to practical applications in real-world scenarios.

# Unveiling Ansible

## Understanding Ansible

Ansible is an open-source automation tool that utilizes YAML (Yet Another Markup Language) syntax for defining automation tasks. It offers a simple, agentless approach to automation, allowing users to manage multiple servers efficiently and ensure consistency across their infrastructure.

## Installing Ansible

Installing Ansible is straightforward, whether on Debian or Ubuntu. Here's how I did it:

### Install on Debian:

```bash
apt install gpg -y
```
```bash
UBUNTU_CODENAME=jammy
wget -O- "https://keyserver.ubuntu.com/pks/lookup?fingerprint=on&op=get&search=0x6125E2A8C77F2818FB7BD15B93C4A3FD7BB9C367" | gpg --dearmour -o /usr/share/keyrings/ansible-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/ansible-archive-keyring.gpg] http://ppa.launchpad.net/ansible/ansible/ubuntu $UBUNTU_CODENAME main" | tee /etc/apt/sources.list.d/ansible.list
```
```bash
apt update && apt upgrade && apt install ansible -y 
```

### Install on Ubuntu:

```bash
apt remove ansible -y
apt update -y
apt install software-properties-common -y
add-apt-repository --yes --update ppa:ansible/ansible
apt install ansible -y
```

## Creating Inventory

To manage servers with Ansible, creating an inventory file is essential. Here's a snippet of how to create and structure an inventory file:

```ini
[servers]
name ansible_host=IP ansible_user=username ansible_password=password ansible_become_pass=password
```

{{< alert >}}
**Notes to Remember**
- Set `host_key_checking = False` in `ansible.cfg` for smoother operations.
- Use `ansible servers -m ping` to ping machines.
- Execute Ansible playbooks with `ansible-playbook playbook.yml` make sure to change `playbook.yml` to your actual playbook name.
- Reboot servers with `ansible servers -a "reboot"`.
{{< /alert >}}

## Crafting Playbooks for Automation

### GPU Power Limit Playbook:

```yaml
---
- name: Set GPU Power Limit
  hosts: your_target_server
  become: yes  # Run tasks with sudo

  tasks:
    - name: Create GPU power limit script
      copy:
        content: |
          #!/bin/bash

          while true; do
              if command -v nvidia-smi &> /dev/null; then
                  nvidia-smi -i 0 -pl 300
                  echo "GPU power limit set to 300W"
              else
                  echo "NVIDIA System Management Interface (nvidia-smi) not found. Make sure NVIDIA GPU drivers are installed."
              fi

              sleep 1
          done
        dest: /gpu_power_limit.sh
        mode: 0755

    - name: Add cron job to run script every minute
      cron:
        name: "set_gpu_power_limit"
        job: "* * * * * /gpu_power_limit.sh"
        user: root
```

### Install Portainer Playbook:

```yaml
---
- name: Update and upgrade servers, install Docker, and set up Portainer
  hosts: your_target_server
  become: yes
  tasks:
    - name: Update apt package cache and upgrade packages
      apt:
        update_cache: yes
        upgrade: dist

    - name: Install prerequisite packages for Docker
      apt:
        name:
          - apt-transport-https
          - ca-certificates
          - curl
          - gnupg-agent
          - software-properties-common

    - name: Add Docker GPG key
      apt_key:
        url: https://download.docker.com/linux/debian/gpg
        state: present

    - name: Add Docker APT repository
      apt_repository:
        repo: deb [arch=amd64] https://download.docker.com/linux/debian {{ ansible_distribution_release }} stable
        state: present

    - name: Install Docker
      apt:
        name: docker-ce docker-ce-cli containerd.io
        state: present

    - name: Create Portainer data volume
      command: docker volume create portainer_data

    - name: Run Portainer container
      command: >
        docker run -d -p 8000:8000 -p 9443:9443 --name portainer --restart=always
        -v /var/run/docker.sock:/var/run/docker.sock
        -v portainer_data:/data
        portainer/portainer-ce:latest
      args:
        creates: /data/portainer_data
```

### Reboot Servers Playbook:

```yaml
---
- name: Reboot API Servers
  hosts: your_target_server
  become: yes  # Run tasks with elevated privileges (sudo)

  tasks:
    - name: Reboot host
      command: "sudo reboot"

    - name: Wait for 30 seconds before proceeding to the next server
      wait_for:
        timeout: 30
      delegate_to: localhost
      when: inventory_hostname != ansible_play_hosts_all[-1]
```

### SSH Playbook:

```yaml
---
- name: Configure SSH settings and reboot server
  hosts: your_target_server
  become: yes

  tasks:
    - name: Edit sshd_config file
      ansible.builtin.lineinfile:
        path: /etc/ssh/sshd_config
        regexp: '#PermitRootLogin prohibit-password'
        line: 'PermitRootLogin yes'
      notify: Reboot Server
    
    - name: Reboot host
      command: "sudo reboot"
```

## Insights and Learnings

### Empowered Automation

Ansible empowered me to automate various tasks efficiently, from server configuration to application deployment, reducing manual effort and ensuring consistency across environments.

### Enhanced Productivity

By leveraging Ansible's playbook-driven automation, I was able to streamline operations, enhance collaboration, and accelerate delivery timelines, thereby boosting productivity and efficiency.

### Continuous Improvement

Through my journey with Ansible, I gained valuable insights into automation best practices, honed my skills in YAML playbook development, and continued to explore new ways to optimize and refine automation workflows.

## Conclusion

### A Journey of Automation Excellence

In conclusion, my journey with Ansible at **AI Media Group** has been transformative, shaping my approach to automation and empowering me to achieve new levels of efficiency and effectiveness in managing IT infrastructure and workflows.

As I continue to explore the possibilities of Ansible and automation, I look forward to further harnessing its capabilities to drive innovation, streamline operations, and unlock new opportunities for growth and success in the ever-evolving landscape of IT automation.

