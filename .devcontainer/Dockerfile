FROM ubuntu:22.04

# Nicht-interaktive Installation
ENV DEBIAN_FRONTEND=noninteractive

# System aktualisieren und alle benötigten Netzwerk-Tools installieren
RUN apt-get update && apt-get install -y \
    # Netzwerk-Tools
    iproute2 \
    iputils-ping \
    traceroute \
    dnsutils \
    net-tools \
    curl \
    wget \
    nmap \
    netcat \
    tcpdump \
    whois \
    # Node.js (für den Krypto-Teil)
    nodejs \
    npm \
    # Hilfsprogramme
    sudo \
    bash-completion \
    less \
    vim \
    nano \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Nicht-root Benutzer anlegen
ARG USERNAME=student
ARG USER_UID=1000
ARG USER_GID=1000

RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
    && echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

USER $USERNAME
WORKDIR /workspace

# Bash-Completion aktivieren
RUN echo "source /etc/bash_completion" >> ~/.bashrc
