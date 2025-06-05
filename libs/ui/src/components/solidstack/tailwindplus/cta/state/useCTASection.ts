import { createSignal, createEffect, onCleanup } from "solid-js"
import { createStore } from "solid-js/store"

export interface CTASectionContext {
  activeButton: string | null
  isVisible: boolean
  animationPhase: "loading" | "animating" | "complete"
  hoveredButton: string | null
  theme: "light" | "dark"
  animationsEnabled: boolean
  formState: "idle" | "submitting" | "success" | "error"
  formData: Record<string, any>
  buttonStates: Map<string, "idle" | "loading" | "success" | "error">
}

export interface CTASectionState {
  value: "initializing" | "idle" | "animating" | "interacting" | "submitting"
  context: CTASectionContext
}

export interface CTASectionAPI {
  state: () => CTASectionState
  mount: () => void
  startAnimation: () => void
  completeAnimation: () => void
  hoverButton: (buttonId: string) => void
  unhoverButton: () => void
  clickButton: (buttonId: string) => void
  setButtonState: (buttonId: string, state: "idle" | "loading" | "success" | "error") => void
  submitForm: (data: Record<string, any>) => void
  setFormState: (state: "idle" | "submitting" | "success" | "error") => void
  updateFormData: (field: string, value: any) => void
  resetForm: () => void
  toggleTheme: () => void
  toggleAnimations: () => void
  isButtonHovered: (buttonId: string) => boolean
  isButtonActive: (buttonId: string) => boolean
  getButtonState: (buttonId: string) => "idle" | "loading" | "success" | "error"
  getAnimationPhase: () => "loading" | "animating" | "complete"
  getTheme: () => "light" | "dark"
  areAnimationsEnabled: () => boolean
  getFormState: () => "idle" | "submitting" | "success" | "error"
  getFormData: () => Record<string, any>
}

export function useCTASection(): CTASectionAPI {
  const [currentState, setCurrentState] = createSignal<"initializing" | "idle" | "animating" | "interacting" | "submitting">("initializing")
  
  const [context, setContext] = createStore<CTASectionContext>({
    activeButton: null,
    isVisible: false,
    animationPhase: "loading",
    hoveredButton: null,
    theme: "light",
    animationsEnabled: true,
    formState: "idle",
    formData: {},
    buttonStates: new Map(),
  })

  // Handle intersection observer for CTA sections
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
    setCurrentState("animating")
    
    // Auto-complete animation after delay
    setTimeout(() => {
      completeAnimation()
    }, 1000)
  }

  const completeAnimation = () => {
    setContext("animationPhase", "complete")
    setCurrentState("idle")
  }

  const hoverButton = (buttonId: string) => {
    setContext("hoveredButton", buttonId)
    setCurrentState("interacting")
  }

  const unhoverButton = () => {
    setContext("hoveredButton", null)
    setCurrentState("idle")
  }

  const clickButton = (buttonId: string) => {
    setContext("activeButton", buttonId)
    setCurrentState("interacting")
    
    // Reset active button after short delay
    setTimeout(() => {
      if (context.activeButton === buttonId) {
        setContext("activeButton", null)
        if (currentState() === "interacting") {
          setCurrentState("idle")
        }
      }
    }, 200)
  }

  const setButtonState = (buttonId: string, state: "idle" | "loading" | "success" | "error") => {
    const newButtonStates = new Map(context.buttonStates)
    newButtonStates.set(buttonId, state)
    setContext("buttonStates", newButtonStates)
  }

  const submitForm = (data: Record<string, any>) => {
    setContext("formData", data)
    setContext("formState", "submitting")
    setCurrentState("submitting")
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
      }, 3000)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setContext("formData", field, value)
  }

  const resetForm = () => {
    setContext("formData", {})
    setContext("formState", "idle")
    setCurrentState("idle")
  }

  const toggleTheme = () => {
    setContext("theme", context.theme === "light" ? "dark" : "light")
  }

  const toggleAnimations = () => {
    setContext("animationsEnabled", !context.animationsEnabled)
  }

  const isButtonHovered = (buttonId: string): boolean => {
    return context.hoveredButton === buttonId
  }

  const isButtonActive = (buttonId: string): boolean => {
    return context.activeButton === buttonId
  }

  const getButtonState = (buttonId: string): "idle" | "loading" | "success" | "error" => {
    return context.buttonStates.get(buttonId) || "idle"
  }

  const getAnimationPhase = () => context.animationPhase
  const getTheme = () => context.theme
  const areAnimationsEnabled = () => context.animationsEnabled
  const getFormState = () => context.formState
  const getFormData = () => context.formData

  const state = (): CTASectionState => ({
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
    hoverButton,
    unhoverButton,
    clickButton,
    setButtonState,
    submitForm,
    setFormState,
    updateFormData,
    resetForm,
    toggleTheme,
    toggleAnimations,
    isButtonHovered,
    isButtonActive,
    getButtonState,
    getAnimationPhase,
    getTheme,
    areAnimationsEnabled,
    getFormState,
    getFormData,
  }
}