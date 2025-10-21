-- LSP Configuration for all languages

local M = {}

function M.setup()
  -- LSP servers configuration
  local servers = {
    -- Rust
    rust_analyzer = {
      settings = {
        ["rust-analyzer"] = {
          cargo = {
            allFeatures = true,
            loadOutDirsFromCheck = true,
            runBuildScripts = true,
          },
          checkOnSave = {
            command = "clippy",
            extraArgs = { "--all", "--", "-W", "clippy::all" },
          },
          procMacro = {
            enable = true,
            ignored = {
              ["async-trait"] = { "async_trait" },
              ["napi-derive"] = { "napi" },
              ["async-recursion"] = { "async_recursion" },
            },
          },
          inlayHints = {
            bindingModeHints = { enable = true },
            chainingHints = { enable = true },
            closingBraceHints = { enable = true, minLines = 25 },
            closureReturnTypeHints = { enable = "always" },
            lifetimeElisionHints = { enable = "always", useParameterNames = true },
            maxLength = 25,
            parameterHints = { enable = true },
            reborrowHints = { enable = "always" },
            renderColons = true,
            typeHints = { enable = true, hideClosureInitialization = false, hideNamedConstructor = false },
          },
        },
      },
    },

    -- TypeScript/JavaScript
    tsserver = {
      settings = {
        typescript = {
          inlayHints = {
            includeInlayParameterNameHints = "all",
            includeInlayParameterNameHintsWhenArgumentMatchesName = false,
            includeInlayFunctionParameterTypeHints = true,
            includeInlayVariableTypeHints = true,
            includeInlayPropertyDeclarationTypeHints = true,
            includeInlayFunctionLikeReturnTypeHints = true,
            includeInlayEnumMemberValueHints = true,
          },
        },
        javascript = {
          inlayHints = {
            includeInlayParameterNameHints = "all",
            includeInlayParameterNameHintsWhenArgumentMatchesName = false,
            includeInlayFunctionParameterTypeHints = true,
            includeInlayVariableTypeHints = true,
            includeInlayPropertyDeclarationTypeHints = true,
            includeInlayFunctionLikeReturnTypeHints = true,
            includeInlayEnumMemberValueHints = true,
          },
        },
      },
    },

    -- Python
    pylsp = {
      settings = {
        pylsp = {
          plugins = {
            pycodestyle = { enabled = true, ignore = { "E501", "W503" } },
            pyflakes = { enabled = true },
            pylint = { enabled = true, args = { "--disable=C0111" } },
            mypy = { enabled = true },
            black = { enabled = true },
            isort = { enabled = true },
            yapf = { enabled = false },
          },
        },
      },
    },

    -- Go
    gopls = {
      settings = {
        gopls = {
          gofumpt = true,
          codelenses = {
            gc_details = false,
            generate = true,
            regenerate_cgo = true,
            run_govulncheck = true,
            test = true,
            tidy = true,
            upgrade_dependency = true,
            vendor = true,
          },
          hints = {
            assignVariableTypes = true,
            compositeLiteralFields = true,
            compositeLiteralTypes = true,
            constantValues = true,
            functionTypeParameters = true,
            parameterNames = true,
            rangeVariableTypes = true,
          },
          analyses = {
            fieldalignment = true,
            nilness = true,
            unusedparams = true,
            unusedwrite = true,
            useany = true,
          },
          usePlaceholders = true,
          completeUnimported = true,
          staticcheck = true,
          directoryFilters = { "-.git", "-.vscode", "-.idea", "-.vscode-test", "-node_modules" },
          semanticTokens = true,
        },
      },
    },

    -- C/C++
    clangd = {
      cmd = {
        "clangd",
        "--background-index",
        "--clang-tidy",
        "--header-insertion=iwyu",
        "--completion-style=detailed",
        "--function-arg-placeholders",
        "--fallback-style=llvm",
        "--suggest-missing-includes",
        "--cross-file-rename",
        "--enable-config",
      },
      init_options = {
        usePlaceholders = true,
        completeUnimported = true,
        clangdFileStatus = true,
      },
    },

    -- Java
    jdtls = {
      cmd = { "jdtls" },
      settings = {
        java = {
          eclipse = { downloadSources = true },
          configuration = { updateBuildConfiguration = "interactive" },
          maven = { downloadSources = true },
          implementationsCodeLens = { enabled = true },
          referencesCodeLens = { enabled = true },
          references = { includeDecompiledSources = true },
          inlayHints = { parameterNames = { enabled = "all" } },
          format = { enabled = true },
          signatureHelp = { enabled = true },
        },
      },
    },

    -- Ruby
    solargraph = {
      settings = {
        solargraph = {
          diagnostics = true,
          completion = true,
          hover = true,
          symbols = true,
          definitions = true,
          rename = true,
          references = true,
          folding = true,
          highlights = true,
        },
      },
    },

    -- PHP
    intelephense = {
      settings = {
        intelephense = {
          files = { maxSize = 1000000 },
          environment = { phpVersion = "8.2" },
          completion = { fullyQualifyGlobalConstantsAndFunctions = true },
          diagnostics = { enable = true },
        },
      },
    },

    -- Elixir
    elixirls = {
      cmd = { "elixir-ls" },
      settings = {
        elixirLS = {
          dialyzerEnabled = true,
          fetchDeps = false,
          enableTestLenses = true,
          suggestSpecs = true,
        },
      },
    },

    -- Kotlin
    kotlin_language_server = {
      settings = {
        kotlin = {
          compiler = { jvm = { target = "17" } },
          completion = { snippets = { enabled = true } },
          linting = { debounceTime = 250 },
        },
      },
    },

    -- C#/.NET
    omnisharp = {
      cmd = { "omnisharp", "-lsp" },
      settings = {
        omnisharp = {
          enableRoslynAnalyzers = true,
          enableImportCompletion = true,
          organizeImportsOnFormat = true,
          enableAsyncCompletion = true,
        },
      },
    },

    -- Lua
    lua_ls = {
      settings = {
        Lua = {
          runtime = { version = "LuaJIT" },
          diagnostics = { globals = { "vim" } },
          workspace = {
            library = vim.api.nvim_get_runtime_file("", true),
            checkThirdParty = false,
          },
          telemetry = { enable = false },
          hint = { enable = true },
        },
      },
    },

    -- Docker
    dockerls = {},
    docker_compose_language_service = {},

    -- YAML
    yamlls = {
      settings = {
        yaml = {
          schemas = {
            ["https://json.schemastore.org/github-workflow.json"] = "/.github/workflows/*",
            ["https://raw.githubusercontent.com/compose-spec/compose-spec/master/schema/compose-spec.json"] = "docker-compose*.yml",
            ["https://json.schemastore.org/kustomization.json"] = "kustomization.yaml",
          },
        },
      },
    },

    -- JSON
    jsonls = {
      settings = {
        json = {
          schemas = require("schemastore").json.schemas(),
          validate = { enable = true },
        },
      },
    },

    -- HTML/CSS
    html = {},
    cssls = {},
    tailwindcss = {},

    -- Markdown
    marksman = {},

    -- Bash
    bashls = {},

    -- SQL
    sqls = {},

    -- GraphQL
    graphql = {},

    -- Terraform
    terraformls = {},

    -- Ansible
    ansiblels = {},
  }

  -- Setup nvim-lspconfig
  local lspconfig = require("lspconfig")
  local capabilities = require("cmp_nvim_lsp").default_capabilities()

  -- Setup each server
  for server, config in pairs(servers) do
    config.capabilities = capabilities
    config.on_attach = M.on_attach
    lspconfig[server].setup(config)
  end

  -- Setup diagnostics
  vim.diagnostic.config({
    virtual_text = {
      prefix = "●",
      source = "if_many",
    },
    float = {
      source = "always",
      border = "rounded",
    },
    signs = true,
    underline = true,
    update_in_insert = false,
    severity_sort = true,
  })

  -- Setup diagnostic signs
  local signs = { Error = " ", Warn = " ", Hint = " ", Info = " " }
  for type, icon in pairs(signs) do
    local hl = "DiagnosticSign" .. type
    vim.fn.sign_define(hl, { text = icon, texthl = hl, numhl = hl })
  end
end

-- LSP on_attach function
function M.on_attach(client, bufnr)
  -- Enable completion
  vim.api.nvim_buf_set_option(bufnr, "omnifunc", "v:lua.vim.lsp.omnifunc")

  -- Keymaps
  local opts = { noremap = true, silent = true, buffer = bufnr }
  local keymap = vim.keymap.set

  keymap("n", "gD", vim.lsp.buf.declaration, opts)
  keymap("n", "gd", vim.lsp.buf.definition, opts)
  keymap("n", "K", vim.lsp.buf.hover, opts)
  keymap("n", "gi", vim.lsp.buf.implementation, opts)
  keymap("n", "<C-k>", vim.lsp.buf.signature_help, opts)
  keymap("n", "<leader>wa", vim.lsp.buf.add_workspace_folder, opts)
  keymap("n", "<leader>wr", vim.lsp.buf.remove_workspace_folder, opts)
  keymap("n", "<leader>wl", function() print(vim.inspect(vim.lsp.buf.list_workspace_folders())) end, opts)
  keymap("n", "<leader>D", vim.lsp.buf.type_definition, opts)
  keymap("n", "<leader>rn", vim.lsp.buf.rename, opts)
  keymap({ "n", "v" }, "<leader>ca", vim.lsp.buf.code_action, opts)
  keymap("n", "gr", vim.lsp.buf.references, opts)
  keymap("n", "<leader>f", function() vim.lsp.buf.format { async = true } end, opts)

  -- Enable inlay hints if supported
  if client.server_capabilities.inlayHintProvider then
    vim.lsp.inlay_hint.enable(bufnr, true)
  end

  -- Enable semantic tokens
  if client.server_capabilities.semanticTokensProvider then
    vim.lsp.semantic_tokens.start(bufnr, client.id)
  end
end

return M