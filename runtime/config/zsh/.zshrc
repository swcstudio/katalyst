# Katalyst Terminal - Optimized ZSH Configuration
# Performance-optimized for instant prompt and minimal latency

# Enable Powerlevel10k instant prompt. Should stay close to the top.
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

# Profiling (uncomment to debug slow startup)
# zmodload zsh/zprof

# Path to oh-my-zsh installation
export ZSH="$HOME/.oh-my-zsh"

# Set theme - Powerlevel10k for maximum performance and features
ZSH_THEME="powerlevel10k/powerlevel10k"

# Performance optimizations
DISABLE_UPDATE_PROMPT=true
DISABLE_AUTO_UPDATE=true
COMPLETION_WAITING_DOTS=false
DISABLE_UNTRACKED_FILES_DIRTY=true

# Plugins - carefully selected for performance
plugins=(
  git                    # Git integration
  zsh-autosuggestions   # Fish-like autosuggestions
  zsh-syntax-highlighting # Syntax highlighting
  fast-syntax-highlighting # Even faster highlighting
  zsh-completions       # Additional completions
  fzf                   # Fuzzy finder integration
  z                     # Directory jumping
  colored-man-pages     # Colorized man pages
  command-not-found     # Suggest packages
  extract              # Universal archive extractor
  sudo                 # ESC twice to add sudo
  history-substring-search # Better history search
  zsh-vi-mode          # Vi mode for zsh
)

# Source oh-my-zsh
source $ZSH/oh-my-zsh.sh

# User configuration

# Performance: Lazy load NVM, RVM, etc.
lazy_load_nvm() {
  unset -f node npm nvm
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
  [ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion"
}

node() { lazy_load_nvm; node "$@"; }
npm() { lazy_load_nvm; npm "$@"; }
nvm() { lazy_load_nvm; nvm "$@"; }

# History optimization
HISTSIZE=50000
SAVEHIST=50000
HISTFILE=~/.zsh_history
setopt EXTENDED_HISTORY
setopt HIST_EXPIRE_DUPS_FIRST
setopt HIST_IGNORE_DUPS
setopt HIST_IGNORE_SPACE
setopt HIST_VERIFY
setopt INC_APPEND_HISTORY
setopt SHARE_HISTORY

# Directory navigation
setopt AUTO_CD
setopt AUTO_PUSHD
setopt PUSHD_IGNORE_DUPS
setopt PUSHDMINUS

# Completion system optimizations
zstyle ':completion:*' matcher-list 'm:{a-z}={A-Z}'
zstyle ':completion:*' menu select
zstyle ':completion:*' use-cache on
zstyle ':completion:*' cache-path ~/.zsh/cache
zstyle ':completion:*' list-colors "${(s.:.)LS_COLORS}"
zstyle ':completion:*' group-name ''
zstyle ':completion:*:descriptions' format '%F{yellow}-- %d --%f'

# FZF configuration for maximum speed
export FZF_DEFAULT_COMMAND='rg --files --hidden --follow --glob "!.git/*"'
export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"
export FZF_DEFAULT_OPTS='
  --height=40%
  --layout=reverse
  --info=inline
  --border
  --preview="bat --style=numbers --color=always {}"
  --preview-window=right:60%:wrap
  --bind="ctrl-d:preview-down,ctrl-u:preview-up"
  --bind="ctrl-f:preview-page-down,ctrl-b:preview-page-up"
  --bind="ctrl-y:execute-silent(echo {} | pbcopy)"
  --bind="ctrl-x:execute(rm -i {})"
  --bind="ctrl-o:execute(code {})"
'

# Aliases for productivity
alias ll='exa -la --icons --git'
alias ls='exa --icons'
alias tree='exa --tree --icons'
alias cat='bat'
alias grep='rg'
alias find='fd'
alias vim='nvim'
alias top='btm'
alias htop='btm'
alias df='duf'
alias du='dust'
alias ps='procs'
alias sed='sd'
alias cd='z'

# Git aliases
alias g='git'
alias ga='git add'
alias gc='git commit'
alias gco='git checkout'
alias gd='git diff'
alias gl='git log --oneline --graph'
alias gp='git push'
alias gpl='git pull'
alias gs='git status'

# Docker aliases
alias d='docker'
alias dc='docker-compose'
alias dps='docker ps'
alias dex='docker exec -it'

# Kubernetes aliases
alias k='kubectl'
alias kgp='kubectl get pods'
alias kgs='kubectl get services'
alias kgd='kubectl get deployments'

# Development aliases
alias dev='npm run dev'
alias build='npm run build'
alias test='npm test'
alias lint='npm run lint'

# Rust aliases
alias c='cargo'
alias cb='cargo build'
alias cr='cargo run'
alias ct='cargo test'
alias cc='cargo check'
alias cf='cargo fmt'
alias ccl='cargo clippy'

# Functions

# Quick directory creation and navigation
mkcd() {
  mkdir -p "$1" && cd "$1"
}

# Extract any archive
extract() {
  if [ -f $1 ]; then
    case $1 in
      *.tar.bz2)   tar xjf $1     ;;
      *.tar.gz)    tar xzf $1     ;;
      *.bz2)       bunzip2 $1     ;;
      *.rar)       unrar e $1     ;;
      *.gz)        gunzip $1      ;;
      *.tar)       tar xf $1      ;;
      *.tbz2)      tar xjf $1     ;;
      *.tgz)       tar xzf $1     ;;
      *.zip)       unzip $1       ;;
      *.Z)         uncompress $1  ;;
      *.7z)        7z x $1        ;;
      *)     echo "'$1' cannot be extracted" ;;
    esac
  else
    echo "'$1' is not a valid file"
  fi
}

# Quick git commit
gquick() {
  git add -A && git commit -m "$1" && git push
}

# Search and replace in directory
replace() {
  rg -l "$1" | xargs sd "$1" "$2"
}

# Kill process by name
killp() {
  ps aux | grep -v grep | grep "$1" | awk '{print $2}' | xargs kill -9
}

# Weather
weather() {
  curl "wttr.in/${1:-}"
}

# System info
sysinfo() {
  echo "CPU: $(sysctl -n machdep.cpu.brand_string 2>/dev/null || lscpu | grep 'Model name' | awk -F: '{print $2}' | xargs)"
  echo "Memory: $(free -h 2>/dev/null | awk '/^Mem:/ {print $2}' || sysctl -n hw.memsize | awk '{print $1/1024/1024/1024 " GB"}')"
  echo "Disk: $(df -h / | awk 'NR==2 {print $2 " (" $5 " used)"}')"
  echo "Uptime: $(uptime | awk -F'up ' '{print $2}' | awk -F',' '{print $1}')"
}

# Quick benchmark
bench() {
  hyperfine "$@"
}

# Load local configuration if it exists
[[ -f ~/.zshrc.local ]] && source ~/.zshrc.local

# Load Powerlevel10k configuration
[[ -f ~/.p10k.zsh ]] && source ~/.p10k.zsh

# Enable zoxide for smart cd
eval "$(zoxide init zsh)"

# Enable starship prompt (alternative to p10k)
# eval "$(starship init zsh)"

# Performance: compile zsh functions
autoload -U compinit && compinit -C
autoload -U bashcompinit && bashcompinit

# Profiling end (uncomment to debug)
# zprof