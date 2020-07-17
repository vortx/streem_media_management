FROM vortxman/ubuntu:deploy

LABEL maintainer="VorTX <info@taskdoit.com>"

# Versions of Nginx and nginx-rtmp-module to use
ENV NGINX_VERSION nginx-1.17.6

# Install dependencies
RUN apt-get update && \
    apt-get install -y ca-certificates openssl git build-essential ffmpeg libpcre3 libpcre3-dev libssl-dev zlib1g-dev wget curl htop mc && \
    rm -rf /var/lib/apt/lists/*

# Download and decompress Nginx
RUN mkdir -p /tmp/build/nginx && \
    cd /tmp/build/nginx && \
    wget -O ${NGINX_VERSION}.tar.gz https://nginx.org/download/${NGINX_VERSION}.tar.gz && \
    tar -zxf ${NGINX_VERSION}.tar.gz

# Download and decompress RTMP module
RUN mkdir -p /tmp/build/nginx-rtmp-module && \
    cd /tmp/build/nginx-rtmp-module && \
    git clone https://github.com/vortx/nginx-rtmp-module.git .

RUN useradd --no-create-home nginx
# Build and install Nginx
# The default puts everything under /usr/local/nginx, so it's needed to change
# it explicitly. Not just for order but to have it in the PATH
RUN cd /tmp/build/nginx/${NGINX_VERSION} && \
    ./configure \
        --sbin-path=/usr/local/sbin/nginx \
        --conf-path=/etc/nginx/nginx.conf \
        --error-log-path=/var/log/nginx/error.log \
        --pid-path=/var/run/nginx/nginx.pid \
        --lock-path=/var/lock/nginx/nginx.lock \
        --http-log-path=/var/log/nginx/access.log \
        --http-client-body-temp-path=/tmp/nginx-client-body \
        --with-http_ssl_module \
        --with-threads \
        --with-ipv6 \
        --add-module=/tmp/build/nginx-rtmp-module && \
    make -j 1 && \
    make install && \
    mkdir /var/lock/nginx && \
    rm -rf /tmp/build

# Forward logs to Docker
RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log


# Set up config file
#COPY nginx.conf /etc/nginx/nginx.conf

# Create config folder
RUN mkdir /it && mkdir /opt/nginx && \
    cd /it && mkdir /hls && mkdir /playlist && mkdir /vod


EXPOSE 1935
EXPOSE 81

CMD ["nginx", "-g", "daemon on;","/bin/bash"]