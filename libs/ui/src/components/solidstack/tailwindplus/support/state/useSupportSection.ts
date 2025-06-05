import { createSignal, createEffect, onCleanup } from "solid-js"
import { createStore } from "solid-js/store"

export interface SupportCard {
  id: string
  name: string
  description: string
  icon: any
  href?: string
  contactMethod?: "email" | "phone" | "chat" | "form"
  available?: boolean
}

export interface SupportSectionContext {
  activeCard: string | null
  hoveredCard: string | null
  selectedContactMethod: string | null
  isVisible: boolean
  animationPhase: "loading" | "animating" | "complete"
  theme: "light" | "dark"
  animationsEnabled: boolean
  formState: "idle" | "submitting" | "success" | "error"
  contactStates: Map<string, "idle" | "loading" | "success" | "error">
  filterMode: "all" | "available" | "priority"
  supportCards: SupportCard[]
  searchQuery: string
  submitData: Record<string, any>
}

export interface SupportSectionState {
  value: "initializing" | "idle" | "browsing" | "interacting" | "contacting" | "submitting" | "filtering"
  context: SupportSectionContext
}

export interface SupportSectionAPI {
  state: () => SupportSectionState
  mount: () => void
  startAnimation: () => void
  completeAnimation: () => void
  hoverCard: (cardId: string) => void
  unhoverCard: () => void
  selectCard: (cardId: string) => void
  initiateContact: (cardId: string, method?: string) => void
  setContactState: (cardId: string, state: "idle" | "loading" | "success" | "error") => void
  setFormState: (state: "idle" | "submitting" | "success" | "error") => void
  submitContact: (cardId: string, data: Record<string, any>) => void
  updateSupportCards: (cards: SupportCard[]) => void
  setFilterMode: (mode: "all" | "available" | "priority") => void
  setSearchQuery: (query: string) => void
  toggleTheme: () => void
  toggleAnimations: () => void
  isCardHovered: (cardId: string) => boolean
  isCardActive: (cardId: string) => boolean
  isCardAvailable: (cardId: string) => boolean
  getContactState: (cardId: string) => "idle" | "loading" | "success" | "error"
  getAnimationPhase: () => "loading" | "animating" | "complete"
  getTheme: () => "light" | "dark"
  areAnimationsEnabled: () => boolean
  getFormState: () => "idle" | "submitting" | "success" | "error"
  getFilterMode: () => "all" | "available" | "priority"
  getSearchQuery: () => string
  getFilteredCards: () => SupportCard[]
}

export function useSupportSection(): SupportSectionAPI {
  const [currentState, setCurrentState] = createSignal<"initializing" | "idle" | "browsing" | "interacting" | "contacting" | "submitting" | "filtering">("initializing")
  
  const [context, setContext] = createStore<SupportSectionContext>({
    activeCard: null,
    hoveredCard: null,
    selectedContactMethod: null,
    isVisible: false,
    animationPhase: "loading",
    theme: "light",
    animationsEnabled: true,
    formState: "idle",
    contactStates: new Map(),
    filterMode: "all",
    supportCards: [],
    searchQuery: "",
    submitData: {},
  })

  // Handle intersection observer for support sections
  let intersectionObserver: IntersectionObserver | undefined

  createEffect(() => {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (context.animationPhase === "loading") {
              startAnimation()
            }
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    )

    onCleanup(() => {
      if (intersectionObserver) {
        intersectionObserver.disconnect()
      }
    })
  })

  const mount = () => {
    setContext("animationPhase", "loading")
    setContext("isVisible", true)
    setCurrentState("idle")
  }

  const startAnimation = () => {
    setContext("animationPhase", "animating")
    setCurrentState("browsing")
    
    // Auto-complete animation after delay
    setTimeout(() => {
      completeAnimation()
    }, 1500)
  }

  const completeAnimation = () => {
    setContext("animationPhase", "complete")
    setCurrentState("idle")
  }

  const hoverCard = (cardId: string) => {
    setContext("hoveredCard", cardId)
    setCurrentState("interacting")
  }

  const unhoverCard = () => {
    setContext("hoveredCard", null)
    setCurrentState("idle")
  }

  const selectCard = (cardId: string) => {
    setContext("activeCard", cardId)
    setCurrentState("contacting")
    
    // Reset after delay if no further interaction
    setTimeout(() => {
      if (context.activeCard === cardId && currentState() === "contacting") {
        setContext("activeCard", null)
        setCurrentState("idle")
      }
    }, 2000)
  }

  const initiateContact = (cardId: string, method?: string) => {
    setContext("activeCard", cardId)
    setContext("selectedContactMethod", method || null)
    setCurrentState("contacting")
    setContactState(cardId, "loading")
  }

  const setContactState = (cardId: string, state: "idle" | "loading" | "success" | "error") => {
    const newContactStates = new Map(context.contactStates)
    newContactStates.set(cardId, state)
    setContext("contactStates", newContactStates)
  }

  const setFormState = (state: "idle" | "submitting" | "success" | "error") => {
    setContext("formState", state)
    
    if (state === "idle") {
      setCurrentState("idle")
    } else if (state === "submitting") {
      setCurrentState("submitting")
    } else {
      // Success or error states
      setCurrentState("interacting")
      
      // Auto-reset to idle after delay
      setTimeout(() => {
        if (context.formState === state) {
          setContext("formState", "idle")
          setCurrentState("idle")
        }
      }, 4000)
    }
  }

  const submitContact = (cardId: string, data: Record<string, any>) => {
    setContext("activeCard", cardId)
    setContext("submitData", data)
    setContext("formState", "submitting")
    setCurrentState("submitting")
    setContactState(cardId, "loading")
    
    // Simulate submission process
    setTimeout(() => {
      setContactState(cardId, "success")
      setFormState("success")
    }, 2000)
  }

  const updateSupportCards = (cards: SupportCard[]) => {
    setContext("supportCards", cards)
  }

  const setFilterMode = (mode: "all" | "available" | "priority") => {
    setContext("filterMode", mode)
    setCurrentState("filtering")
    
    // Return to idle after filter change
    setTimeout(() => {
      if (currentState() === "filtering") {
        setCurrentState("idle")
      }
    }, 300)
  }

  const setSearchQuery = (query: string) => {
    setContext("searchQuery", query)
    setCurrentState("filtering")
    
    // Return to browsing after search
    setTimeout(() => {
      if (currentState() === "filtering") {
        setCurrentState("browsing")
      }
    }, 500)
  }

  const toggleTheme = () => {
    setContext("theme", context.theme === "light" ? "dark" : "light")
  }

  const toggleAnimations = () => {
    setContext("animationsEnabled", !context.animationsEnabled)
  }

  const isCardHovered = (cardId: string): boolean => {
    return context.hoveredCard === cardId
  }

  const isCardActive = (cardId: string): boolean => {
    return context.activeCard === cardId
  }

  const isCardAvailable = (cardId: string): boolean => {
    const card = context.supportCards.find(c => c.id === cardId)
    return card?.available !== false
  }

  const getContactState = (cardId: string): "idle" | "loading" | "success" | "error" => {
    return context.contactStates.get(cardId) || "idle"
  }

  const getAnimationPhase = () => context.animationPhase
  const getTheme = () => context.theme
  const areAnimationsEnabled = () => context.animationsEnabled
  const getFormState = () => context.formState
  const getFilterMode = () => context.filterMode
  const getSearchQuery = () => context.searchQuery

  const getFilteredCards = (): SupportCard[] => {
    let filtered = [...context.supportCards]
    
    // Apply filter mode
    if (context.filterMode === "available") {
      filtered = filtered.filter(card => card.available !== false)
    } else if (context.filterMode === "priority") {
      filtered = filtered.filter(card => card.contactMethod === "phone" || card.contactMethod === "chat")
    }
    
    // Apply search query
    if (context.searchQuery.trim()) {
      const query = context.searchQuery.toLowerCase()
      filtered = filtered.filter(card => 
        card.name.toLowerCase().includes(query) ||
        card.description.toLowerCase().includes(query)
      )
    }
    
    return filtered
  }

  const state = (): SupportSectionState => ({
    value: currentState(),
    context: { ...context }
  })

  // Auto-mount when created
  setTimeout(() => {
    mount()
  }, 0)

  return {
    state,
    mount,
    startAnimation,
    completeAnimation,
    hoverCard,
    unhoverCard,
    selectCard,
    initiateContact,
    setContactState,
    setFormState,
    submitContact,
    updateSupportCards,
    setFilterMode,
    setSearchQuery,
    toggleTheme,
    toggleAnimations,
    isCardHovered,
    isCardActive,
    isCardAvailable,
    getContactState,
    getAnimationPhase,
    getTheme,
    areAnimationsEnabled,
    getFormState,
    getFilterMode,
    getSearchQuery,
    getFilteredCards,
  }
}