# Katalyst Server - Advanced Multi-Language Dockerfile
# Optimized for Phoenix + Python + Claude Code SDK + Rust NIFs
# Production-ready with security, performance, and monitoring
#
# Architecture:
#   - Phoenix/Elixir for web framework and HPC concurrency
#   - Python 3.12 for Claude Code SDK integration
#   - Rust for high-performance NIFs
#   - Multi-stage build for minimal production image
#
ARG ELIXIR_VERSION=1.16.0
ARG OTP_VERSION=26.2.1
ARG PYTHON_VERSION=3.12.8
ARG DEBIAN_VERSION=bookworm-20240513-slim
ARG NODE_VERSION=20

ARG BUILDER_IMAGE="hexpm/elixir:${ELIXIR_VERSION}-erlang-${OTP_VERSION}-debian-${DEBIAN_VERSION}"
ARG RUNNER_IMAGE="debian:${DEBIAN_VERSION}"

FROM ${BUILDER_IMAGE} as builder

# Set environment variables for build optimization
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PIP_NO_CACHE_DIR=1
ENV PIP_DISABLE_PIP_VERSION_CHECK=1

# Install comprehensive build dependencies
RUN apt-get update -y && apt-get install -y \
    # Core build tools
    build-essential \
    git \
    curl \
    wget \
    ca-certificates \
    # Python dependencies
    python3.11 \
    python3.11-dev \
    python3.11-venv \
    python3-pip \
    # System libraries for Python packages
    libffi-dev \
    libssl-dev \
    libbz2-dev \
    libreadline-dev \
    libsqlite3-dev \
    libncurses5-dev \
    libncursesw5-dev \
    xz-utils \
    tk-dev \
    # Additional libraries for Claude Code SDK
    libxml2-dev \
    libxslt1-dev \
    libjpeg-dev \
    libpng-dev \
    # Node.js for assets
    nodejs \
    npm \
    # Cleanup
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install latest Python (3.12) from source for better performance
WORKDIR /tmp
RUN wget https://www.python.org/ftp/python/${PYTHON_VERSION}/Python-${PYTHON_VERSION}.tar.xz \
    && tar -xf Python-${PYTHON_VERSION}.tar.xz \
    && cd Python-${PYTHON_VERSION} \
    && ./configure \
        --enable-optimizations \
        --enable-shared \
        --with-lto \
        --with-computed-gotos \
        --with-system-ffi \
    && make -j$(nproc) \
    && make altinstall \
    && cd / \
    && rm -rf /tmp/Python-${PYTHON_VERSION}*

# Create symlinks for python3 and pip3
RUN ln -sf /usr/local/bin/python3.12 /usr/local/bin/python3 \
    && ln -sf /usr/local/bin/python3.12 /usr/local/bin/python \
    && ln -sf /usr/local/bin/pip3.12 /usr/local/bin/pip3 \
    && ln -sf /usr/local/bin/pip3.12 /usr/local/bin/pip

# Install Rust for high-performance NIF compilation
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y \
    --default-toolchain stable \
    --profile minimal \
    --component rustfmt,clippy
ENV PATH="/root/.cargo/bin:${PATH}"

# Install uv for fast Python package management
RUN pip3 install uv

# Set up application directory
WORKDIR /app

# Install Elixir package managers
RUN mix local.hex --force && \
    mix local.rebar --force

# Set build environment
ENV MIX_ENV="prod"
ENV RUST_ENV="production"

# Copy Python requirements first for caching
COPY pyproject.toml ./
COPY python_bridge.py ./

# Create Python virtual environment and install Claude Code SDK
RUN python3 -m venv .venv \
    && . .venv/bin/activate \
    && uv pip install --upgrade pip setuptools wheel \
    && uv pip install claude-code-sdk>=0.0.19 \
    && uv pip install httpx requests aiohttp \
    && python3 -c "import claude_code_sdk; print('Claude Code SDK installed successfully')"

# Install Elixir dependencies
COPY mix.exs mix.lock ./
RUN mix deps.get --only $MIX_ENV
RUN mkdir config

# Copy compile-time config files before compiling dependencies
COPY config/config.exs config/${MIX_ENV}.exs config/
RUN mix deps.compile

# Copy application code
COPY priv priv
COPY lib lib
COPY assets assets

# Copy Rust NIF source code
COPY native native

# Set up Python environment variables for NIFs
ENV PYTHONPATH="/app/.venv/lib/python3.12/site-packages"
ENV VIRTUAL_ENV="/app/.venv"
ENV PATH="/app/.venv/bin:$PATH"

# Compile assets with Node.js optimizations
RUN mix assets.deploy

# Compile Elixir application with Rust NIFs
RUN mix compile

# Runtime configuration (doesn't require recompilation)
COPY config/runtime.exs config/

# Copy release configuration
COPY rel rel

# Build the release
RUN mix release

################################################################################
# PRODUCTION RUNTIME STAGE
################################################################################
FROM ${RUNNER_IMAGE} as runner

# Set production environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV MIX_ENV="prod"
ENV RUST_ENV="production"
ENV PYTHON_ENV="production"
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install production runtime dependencies
RUN apt-get update -y && apt-get install -y \
    # Core runtime libraries
    libstdc++6 \
    openssl \
    libncurses5 \
    locales \
    ca-certificates \
    # Python 3.12 runtime (minimal installation)
    python3.11 \
    python3.11-venv \
    # System libraries required by Python packages
    libffi8 \
    libssl3 \
    libxml2 \
    libxslt1.1 \
    # Monitoring and debugging tools
    curl \
    htop \
    procps \
    # Cleanup
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python 3.12 in production (optimized build)
WORKDIR /tmp
RUN curl -O https://www.python.org/ftp/python/${PYTHON_VERSION}/Python-${PYTHON_VERSION}.tar.xz \
    && tar -xf Python-${PYTHON_VERSION}.tar.xz \
    && cd Python-${PYTHON_VERSION} \
    && ./configure \
        --enable-optimizations \
        --enable-shared \
        --with-lto \
        --prefix=/usr/local \
    && make -j$(nproc) \
    && make altinstall \
    && cd / \
    && rm -rf /tmp/Python-${PYTHON_VERSION}*

# Create Python symlinks
RUN ln -sf /usr/local/bin/python3.12 /usr/local/bin/python3 \
    && ln -sf /usr/local/bin/python3.12 /usr/local/bin/python \
    && ln -sf /usr/local/bin/pip3.12 /usr/local/bin/pip3 \
    && ln -sf /usr/local/bin/pip3.12 /usr/local/bin/pip

# Set up locales for proper Unicode handling
RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && locale-gen
ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8

# Create application directory
WORKDIR /app

# Create non-root user for security
RUN groupadd --gid 1000 katalyst \
    && useradd --uid 1000 --gid katalyst --shell /bin/bash --create-home katalyst \
    && chown -R katalyst:katalyst /app

# Copy Python virtual environment from builder
COPY --from=builder --chown=katalyst:katalyst /app/.venv /app/.venv

# Copy Python bridge script
COPY --from=builder --chown=katalyst:katalyst /app/python_bridge.py /app/python_bridge.py

# Copy compiled Elixir release
COPY --from=builder --chown=katalyst:katalyst /app/_build/${MIX_ENV}/rel/katalyst ./

# Set Python environment variables
ENV PYTHONPATH="/app/.venv/lib/python3.12/site-packages"
ENV VIRTUAL_ENV="/app/.venv"
ENV PATH="/app/.venv/bin:$PATH"

# Create data directory for persistence
RUN mkdir -p /app/data && chown -R katalyst:katalyst /app/data

# Add health check script
COPY --from=builder --chown=katalyst:katalyst /app/bin/health_check /app/bin/health_check

# Set up monitoring and metrics
EXPOSE 8080 9091 4000

# Switch to non-root user
USER katalyst

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Entry point with better signal handling
ENTRYPOINT ["/app/bin/katalyst"]
CMD ["start"]