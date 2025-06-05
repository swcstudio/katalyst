import { createSignal, createEffect, onCleanup } from "solid-js"
import { createStore } from "solid-js/store"

export interface NewsletterFormData {
  email: string
  firstName?: string
  lastName?: string
  interests?: string[]
  frequency?: "daily" | "weekly" | "monthly"
  acceptedPrivacy: boolean
}

export interface NewsletterSectionContext {
  formData: NewsletterFormData
  isVisible: boolean
  animationPhase: "loading" | "animating" | "complete"
  theme: "light" | "dark"
  animationsEnabled: boolean
  formState: "idle" | "validating" | "submitting" | "success" | "error"
  validationErrors: Record<string, string>
  submitMessage: string
  isEmailValid: boolean
  focusedField: string | null
  hoveredElement: string | null
  subscriptionType: "newsletter" | "updates" | "announcements" | "all"
  variant: "simple" | "centered" | "split" | "card" | "inline"
  showPrivacyPolicy: boolean
  submitCount: number
  lastSubmitTime: number | null
}

export interface NewsletterSectionState {
  value: "initializing" | "idle" | "interacting" | "validating" | "submitting" | "success" | "error" | "animating"
  context: NewsletterSectionContext
}

export interface NewsletterSectionAPI {
  state: () => NewsletterSectionState
  mount: () => void
  startAnimation: () => void
  completeAnimation: () => void
  updateFormData: (field: keyof NewsletterFormData, value: any) => void
  setFormData: (data: Partial<NewsletterFormData>) => void
  validateEmail: (email: string) => boolean
  validateForm: () => boolean
  submitForm: () => Promise<void>
  resetForm: () => void
  setFormState: (state: "idle" | "validating" | "submitting" | "success" | "error") => void
  setValidationError: (field: string, error: string) => void
  clearValidationError: (field: string) => void
  clearAllErrors: () => void
  setFocusedField: (field: string | null) => void
  setHoveredElement: (element: string | null) => void
  setSubscriptionType: (type: "newsletter" | "updates" | "announcements" | "all") => void
  setVariant: (variant: "simple" | "centered" | "split" | "card" | "inline") => void
  togglePrivacyPolicy: () => void
  toggleTheme: () => void
  toggleAnimations: () => void
  getFormData: () => NewsletterFormData
  getValidationErrors: () => Record<string, string>
  getSubmitMessage: () => string
  isFieldFocused: (field: string) => boolean
  isElementHovered: (element: string) => boolean
  isFormValid: () => boolean
  isEmailValid: () => boolean
  canSubmit: () => boolean
  getAnimationPhase: () => "loading" | "animating" | "complete"
  getTheme: () => "light" | "dark"
  areAnimationsEnabled: () => boolean
  getFormState: () => "idle" | "validating" | "submitting" | "success" | "error"
  getSubscriptionType: () => "newsletter" | "updates" | "announcements" | "all"
  getVariant: () => "simple" | "centered" | "split" | "card" | "inline"
  shouldShowPrivacyPolicy: () => boolean
}

export function useNewsletterSection(): NewsletterSectionAPI {
  const [currentState, setCurrentState] = createSignal<"initializing" | "idle" | "interacting" | "validating" | "submitting" | "success" | "error" | "animating">("initializing")
  
  const [context, setContext] = createStore<NewsletterSectionContext>({
    formData: {
      email: "",
      firstName: "",
      lastName: "",
      interests: [],
      frequency: "weekly",
      acceptedPrivacy: false,
    },
    isVisible: false,
    animationPhase: "loading",
    theme: "light",
    animationsEnabled: true,
    formState: "idle",
    validationErrors: {},
    submitMessage: "",
    isEmailValid: false,
    focusedField: null,
    hoveredElement: null,
    subscriptionType: "newsletter",
    variant: "simple",
    showPrivacyPolicy: true,
    submitCount: 0,
    lastSubmitTime: null,
  })

  // Handle intersection observer for newsletter sections
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
    }, 1200)
  }

  const completeAnimation = () => {
    setContext("animationPhase", "complete")
    setCurrentState("idle")
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const validateEmail = (email: string): boolean => {
    return emailRegex.test(email)
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    
    // Validate email
    if (!context.formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!validateEmail(context.formData.email)) {
      errors.email = "Please enter a valid email address"
    }
    
    // Validate privacy policy acceptance if shown
    if (context.showPrivacyPolicy && !context.formData.acceptedPrivacy) {
      errors.privacy = "You must accept the privacy policy"
    }
    
    // Validate first name if provided
    if (context.formData.firstName && context.formData.firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters"
    }
    
    setContext("validationErrors", errors)
    setContext("isEmailValid", validateEmail(context.formData.email))
    
    return Object.keys(errors).length === 0
  }

  const updateFormData = (field: keyof NewsletterFormData, value: any) => {
    setContext("formData", field, value)
    
    // Clear validation error for this field
    if (context.validationErrors[field]) {
      clearValidationError(field)
    }
    
    // Real-time email validation
    if (field === "email") {
      setContext("isEmailValid", validateEmail(value))
    }
    
    setCurrentState("interacting")
  }

  const setFormData = (data: Partial<NewsletterFormData>) => {
    setContext("formData", (prev) => ({ ...prev, ...data }))
    clearAllErrors()
    setCurrentState("interacting")
  }

  const submitForm = async (): Promise<void> => {
    setCurrentState("validating")
    setFormState("validating")
    
    // Validate form
    if (!validateForm()) {
      setFormState("error")
      setContext("submitMessage", "Please fix the errors below")
      setCurrentState("error")
      return
    }
    
    // Check rate limiting
    const now = Date.now()
    if (context.lastSubmitTime && now - context.lastSubmitTime < 5000) {
      setFormState("error")
      setContext("submitMessage", "Please wait before submitting again")
      setCurrentState("error")
      return
    }
    
    setCurrentState("submitting")
    setFormState("submitting")
    setContext("submitMessage", "Subscribing...")
    
    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate occasional failure
          if (Math.random() > 0.9) {
            reject(new Error("Network error"))
          } else {
            resolve(true)
          }
        }, 2000)
      })
      
      setFormState("success")
      setContext("submitMessage", "Thank you for subscribing! Please check your email.")
      setContext("submitCount", context.submitCount + 1)
      setContext("lastSubmitTime", now)
      setCurrentState("success")
      
      // Reset form after success
      setTimeout(() => {
        resetForm()
      }, 5000)
      
    } catch (error) {
      setFormState("error")
      setContext("submitMessage", "Something went wrong. Please try again.")
      setCurrentState("error")
    }
  }

  const resetForm = () => {
    setContext("formData", {
      email: "",
      firstName: "",
      lastName: "",
      interests: [],
      frequency: "weekly",
      acceptedPrivacy: false,
    })
    setContext("validationErrors", {})
    setContext("submitMessage", "")
    setContext("isEmailValid", false)
    setFormState("idle")
    setCurrentState("idle")
  }

  const setFormState = (state: "idle" | "validating" | "submitting" | "success" | "error") => {
    setContext("formState", state)
  }

  const setValidationError = (field: string, error: string) => {
    setContext("validationErrors", field, error)
  }

  const clearValidationError = (field: string) => {
    setContext("validationErrors", (prev) => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  const clearAllErrors = () => {
    setContext("validationErrors", {})
    setContext("submitMessage", "")
  }

  const setFocusedField = (field: string | null) => {
    setContext("focusedField", field)
    if (field) {
      setCurrentState("interacting")
    }
  }

  const setHoveredElement = (element: string | null) => {
    setContext("hoveredElement", element)
    if (element) {
      setCurrentState("interacting")
    }
  }

  const setSubscriptionType = (type: "newsletter" | "updates" | "announcements" | "all") => {
    setContext("subscriptionType", type)
  }

  const setVariant = (variant: "simple" | "centered" | "split" | "card" | "inline") => {
    setContext("variant", variant)
  }

  const togglePrivacyPolicy = () => {
    setContext("showPrivacyPolicy", !context.showPrivacyPolicy)
  }

  const toggleTheme = () => {
    setContext("theme", context.theme === "light" ? "dark" : "light")
  }

  const toggleAnimations = () => {
    setContext("animationsEnabled", !context.animationsEnabled)
  }

  // Getters
  const getFormData = () => context.formData
  const getValidationErrors = () => context.validationErrors
  const getSubmitMessage = () => context.submitMessage
  
  const isFieldFocused = (field: string): boolean => {
    return context.focusedField === field
  }
  
  const isElementHovered = (element: string): boolean => {
    return context.hoveredElement === element
  }
  
  const isFormValid = (): boolean => {
    return Object.keys(context.validationErrors).length === 0 && 
           context.formData.email.trim() !== "" && 
           validateEmail(context.formData.email) &&
           (!context.showPrivacyPolicy || context.formData.acceptedPrivacy)
  }
  
  const isEmailValid = (): boolean => {
    return context.isEmailValid
  }
  
  const canSubmit = (): boolean => {
    return isFormValid() && 
           context.formState !== "submitting" && 
           context.formState !== "validating"
  }

  const getAnimationPhase = () => context.animationPhase
  const getTheme = () => context.theme
  const areAnimationsEnabled = () => context.animationsEnabled
  const getFormState = () => context.formState
  const getSubscriptionType = () => context.subscriptionType
  const getVariant = () => context.variant
  const shouldShowPrivacyPolicy = () => context.showPrivacyPolicy

  const state = (): NewsletterSectionState => ({
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
    updateFormData,
    setFormData,
    validateEmail,
    validateForm,
    submitForm,
    resetForm,
    setFormState,
    setValidationError,
    clearValidationError,
    clearAllErrors,
    setFocusedField,
    setHoveredElement,
    setSubscriptionType,
    setVariant,
    togglePrivacyPolicy,
    toggleTheme,
    toggleAnimations,
    getFormData,
    getValidationErrors,
    getSubmitMessage,
    isFieldFocused,
    isElementHovered,
    isFormValid,
    isEmailValid,
    canSubmit,
    getAnimationPhase,
    getTheme,
    areAnimationsEnabled,
    getFormState,
    getSubscriptionType,
    getVariant,
    shouldShowPrivacyPolicy,
  }
}