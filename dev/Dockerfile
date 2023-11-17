# docker build . -t dev
# docker run -it dev /bin/bash
FROM ubuntu:23.10

# OS founds
RUN apt-get update \
    && apt-get upgrade --assume-yes  \
    && apt-get --assume-yes --no-install-recommends install \
        ca-certificates \
        git \
        httpie 

# Install Neovim ~ https://neovim.io/
RUN apt-get --assume-yes --no-install-recommends install \
        ninja-build \
        gettext \
        libtool \
        libtool-bin \
        autoconf \
        automake \
        cmake \
        g++ \
        pkg-config \
        unzip \
        curl \
        doxygen \
    && apt-get --assume-yes --no-install-recommends install make \
    && git clone https://github.com/neovim/neovim \
    && cd neovim && make CMAKE_BUILD_TYPE=Release && make install \
    && apt-get --assume-yes remove \
        autoconf \
        automake \
        g++ \
        doxygen

# Install AstroVim ~ https://docs.astronvim.com/
RUN git clone --depth 1 https://github.com/AstroNvim/AstroNvim ~/.config/nvim
