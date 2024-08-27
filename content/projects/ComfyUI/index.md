---
title: "Installing ComfyUI on macOS M2"
description: "Discover how to effortlessly set up ComfyUI on your M2 Mac with this comprehensive guide. From installing Homebrew to configuring PyTorch, follow step-by-step instructions to seamlessly integrate ComfyUI into your workflow. Elevate your user interface experience and unlock the full potential of your M2 Mac today!"
categories: ["AIMG Projects", "AI", "Software and Tools", "Tutorials and Guides", "Virtualization"]
date: 2024-04-08
draft: false
showauthor: false
authors:
  - timothysmith
---

# Introduction

If you've recently acquired an M2 Mac and you're eager to explore ComfyUI, you're in the right place. ComfyUI offers a seamless user interface experience, and setting it up on your M2 Mac is a straightforward process. Let's dive into the steps required to get ComfyUI up and running on your system.

## Setting Up the Environment

Firstly, let's create a directory where ComfyUI will reside. You can name this directory anything you like, but for clarity, let's call it `AI`.

```bash
mkdir AI
cd AI
```

Next, let's install `Homebrew`, a powerful package manager tailored for macOS. Visit the official Homebrew website to learn more about its features and benefits.

{{< button href="https://brew.sh/" target="" >}}
Visit Homebrew
{{< /button >}}

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

After Homebrew is installed we now need to install `python3.11`. We can check for current version first then if it is not installed we can install it:

```bash
python3 --version
```
```bash
brew install python@3.11
```

Now that Python3.11 is install we need to upgrade pip and setuptools

```bash
pip3 install --upgrade pip setuptools
```


## Installing PyTorch

`PyTorch` is a crucial library for machine learning tasks, and we'll need it for ComfyUI. Visit [pytorch.org](https://pytorch.org/get-started/locally/) to get the installation command. After visiting the link, execute the following command:

```bash
pip3 install --pre torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cpu
```
## Cloning and Installing ComfyUI

Now that we have the necessary dependencies set up, let's clone the `ComfyUI` repository into our `AI` directory.

```bash
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI
```
Install the required dependencies for ComfyUI.

```bash
pip3 install -r requirements.txt
```

## Running ComfyUI

To run ComfyUI, navigate to the directory where it's located.

```bash
cd ../ComfyUI
```
Execute the following command to start ComfyUI.

```bash
python3.11 main.py
```

{{< alert >}}
to view ComfyUI click the link that looks similar to this:
**https://127.0.0.1:8188**
{{< /alert >}}

## Exiting ComfyUI

To exit ComfyUI at any time, you can press either `CTRL+C` or `CMD+C` in your terminal window.

## Restarting ComfyUI

If you restart your computer, you'll need to navigate back to the directory where ComfyUI is installed and rerun the command to start it.

That's it! You've successfully installed and set up ComfyUI on your M2 Mac. Enjoy exploring its features and capabilities.

