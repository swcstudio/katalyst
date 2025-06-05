import { createMachine } from "@zag-js/core"
import { createSignal, createEffect, onCleanup } from "solid-js"

export interface NavigationContext {
  isMobileMenuOpen: boolean
  activeDropdown: string | null
  isScrolled: boolean
}

export interface NavigationState {
  value: "idle" | "mobileMenuOpen" | "dropdownOpen"
  context: NavigationContext
}

const navigationMachine = createMachine<NavigationContext>({
  id: "navigation",
  initial: "idle",
  context: {
    isMobileMenuOpen: false,
    activeDropdown: null,
    isScrolled: false,
  },
  states: {
    idle: {
      on: {
        TOGGLE_MOBILE_MENU: {
          target: "mobileMenuOpen",
          actions: ["toggleMobileMenu"]
        },
        OPEN_DROPDOWN: {
          target: "dropdownOpen",
          actions: ["openDropdown"]
        },
        SCROLL: {
          actions: ["updateScrollState"]
        }
      }
    },
    mobileMenuOpen: {
      on: {
        TOGGLE_MOBILE_MENU: {
          target: "idle",
          actions: ["closeMobileMenu"]
        },
        CLOSE_MOBILE_MENU: {
          target: "idle",
          actions: ["closeMobileMenu"]
        },
        ESCAPE: {
          target: "idle",
          actions: ["closeMobileMenu"]
        }
      }
    },
    dropdownOpen: {
      on: {
        CLOSE_DROPDOWN: {
          target: "idle",
          actions: ["closeDropdown"]
        },
        OPEN_DROPDOWN: {
          actions: ["openDropdown"]
        },
        ESCAPE: {
          target: "idle",
          actions: ["closeDropdown"]
        },
        CLICK_OUTSIDE: {
          target: "idle",
          actions: ["closeDropdown"]
        }
      }
    }
  }
}, {
  actions: {
    toggleMobileMenu: (context) => {
      context.isMobileMenuOpen = !context.isMobileMenuOpen
    },
    closeMobileMenu: (context) => {
      context.isMobileMenuOpen = false
    },
    openDropdown: (context, event) => {
      context.activeDropdown = event.dropdownId || null
    },
    closeDropdown: (context) => {
      context.activeDropdown = null
    },
    updateScrollState: (context, event) => {
      context.isScrolled = event.scrollY > 10
    }
  }
})

export interface NavigationAPI {
  state: () => NavigationState
  toggleMobileMenu: () => void
  closeMobileMenu: () => void
  openDropdown: (dropdownId: string) => void
  closeDropdown: () => void
  isDropdownOpen: (dropdownId: string) => boolean
  isMobileMenuOpen: () => boolean
  isScrolled: () => boolean
}

export function useNavigation(): NavigationAPI {
  const [state, setState] = createSignal<NavigationState>({
    value: "idle",
    context: {
      isMobileMenuOpen: false,
      activeDropdown: null,
      isScrolled: false,
    }
  })

  let service = navigationMachine.start()

  const updateState = () => {
    setState({
      value: service.state.value as any,
      context: { ...service.state.context }
    })
  }

  service.subscribe(updateState)
  updateState()

  // Handle escape key
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      service.send({ type: "ESCAPE" })
    }
  }

  // Handle scroll events
  const handleScroll = () => {
    service.send({ 
      type: "SCROLL", 
      scrollY: window.scrollY 
    })
  }

  // Handle click outside
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target.closest("[data-dropdown]") && !target.closest("[data-dropdown-trigger]")) {
      service.send({ type: "CLICK_OUTSIDE" })
    }
  }

  createEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    window.addEventListener("scroll", handleScroll)
    document.addEventListener("click", handleClickOutside)

    onCleanup(() => {
      document.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("click", handleClickOutside)
      service.stop()
    })
  })

  return {
    state,
    toggleMobileMenu: () => service.send({ type: "TOGGLE_MOBILE_MENU" }),
    closeMobileMenu: () => service.send({ type: "CLOSE_MOBILE_MENU" }),
    openDropdown: (dropdownId: string) => service.send({ type: "OPEN_DROPDOWN", dropdownId }),
    closeDropdown: () => service.send({ type: "CLOSE_DROPDOWN" }),
    isDropdownOpen: (dropdownId: string) => state().context.activeDropdown === dropdownId,
    isMobileMenuOpen: () => state().context.isMobileMenuOpen,
    isScrolled: () => state().context.isScrolled,
  }
}