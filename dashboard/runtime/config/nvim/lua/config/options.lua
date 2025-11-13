-- Neovim Options Configuration

local opt = vim.opt

-- General
opt.mouse = "a"                      -- Enable mouse support
opt.clipboard = "unnamedplus"        -- System clipboard
opt.swapfile = false                 -- No swap files
opt.backup = false                   -- No backup files
opt.writebackup = false              -- No write backup
opt.undofile = true                  -- Persistent undo
opt.undolevels = 10000               -- Maximum undo levels
opt.updatetime = 200                 -- Faster completion
opt.timeoutlen = 300                 -- Faster key sequence completion
opt.redrawtime = 1500                -- Time to redraw
opt.hidden = true                    -- Enable hidden buffers
opt.history = 1000                   -- Command history
opt.confirm = true                   -- Confirm to save changes

-- UI
opt.number = true                    -- Line numbers
opt.relativenumber = true            -- Relative line numbers
opt.termguicolors = true            -- True color support
opt.signcolumn = "yes:2"            -- Always show sign column
opt.showmode = false                -- Don't show mode
opt.showcmd = true                   -- Show command
opt.cmdheight = 1                   -- Command line height
opt.pumheight = 10                  -- Popup menu height
opt.pumblend = 10                   -- Popup menu transparency
opt.helpheight = 12                 -- Help window height
opt.previewheight = 12              -- Preview window height
opt.showtabline = 2                 -- Always show tabline
opt.laststatus = 3                  -- Global statusline
opt.winbar = "%=%m %f"              -- Window bar
opt.cursorline = true               -- Highlight current line
opt.cursorcolumn = false            -- Don't highlight current column
opt.colorcolumn = "80,120"          -- Color columns
opt.wrap = false                    -- No line wrap
opt.linebreak = true                -- Break lines at word
opt.scrolloff = 8                   -- Vertical scroll offset
opt.sidescrolloff = 8               -- Horizontal scroll offset
opt.guifont = "JetBrainsMono Nerd Font:h11"
opt.title = true                    -- Window title
opt.titlestring = "%<%F%=%l/%L - nvim"

-- Splits
opt.splitbelow = true               -- Split below
opt.splitright = true               -- Split right
opt.splitkeep = "screen"            -- Keep screen position

-- Search
opt.ignorecase = true               -- Ignore case
opt.smartcase = true                -- Smart case
opt.hlsearch = true                 -- Highlight search
opt.incsearch = true                -- Incremental search
opt.grepprg = "rg --vimgrep"        -- Use ripgrep
opt.grepformat = "%f:%l:%c:%m"      -- Grep format

-- Indentation
opt.expandtab = true                -- Use spaces
opt.shiftwidth = 2                  -- Shift width
opt.tabstop = 2                     -- Tab width
opt.softtabstop = 2                 -- Soft tab width
opt.smartindent = true              -- Smart indent
opt.autoindent = true               -- Auto indent
opt.breakindent = true              -- Break indent

-- Folding
opt.foldcolumn = "1"                -- Fold column
opt.foldlevel = 99                  -- Fold level
opt.foldlevelstart = 99             -- Start fold level
opt.foldenable = true               -- Enable folding
opt.foldmethod = "expr"             -- Expression folding
opt.foldexpr = "nvim_treesitter#foldexpr()"

-- Completion
opt.completeopt = "menu,menuone,noselect,preview"
opt.shortmess:append("c")           -- Don't show completion messages
opt.iskeyword:append("-")           -- Treat dash as word

-- Performance
opt.lazyredraw = false              -- Don't redraw while executing macros
opt.synmaxcol = 240                -- Max column for syntax highlight
opt.updatetime = 250                -- Faster completion

-- File handling
opt.fileencoding = "utf-8"          -- File encoding
opt.autoread = true                 -- Auto read file changes
opt.autowrite = true                -- Auto write file changes

-- Session
opt.sessionoptions = "blank,buffers,curdir,folds,help,tabpages,winsize,winpos,terminal,localoptions"

-- Diff
opt.diffopt:append("linematch:60")  -- Better diff algorithm

-- List chars
opt.list = true
opt.listchars = {
  tab = "→ ",
  trail = "·",
  extends = "⟩",
  precedes = "⟨",
  nbsp = "␣",
  eol = "↲",
}

-- Fill chars
opt.fillchars = {
  foldopen = "",
  foldclose = "",
  fold = " ",
  foldsep = " ",
  diff = "╱",
  eob = " ",
}