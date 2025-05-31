import { createSignal, For } from "solid-js"
import { 
  Accordion, 
  Button, 
  Input, 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter,
  Checkbox,
  Switch,
  Tooltip,
  NumberInput,
  Tabs,
  RadioGroup,
  type AccordionItem,
  type TabItem,
  type RadioOption
} from "./index.ts"

export function ComprehensiveExample() {
  // Form state
  const [formData, setFormData] = createSignal({
    name: "",
    email: "",
    age: 25,
    notifications: false,
    newsletter: false,
    theme: "light",
    plan: "basic"
  })

  // UI state
  const [activeTab, setActiveTab] = createSignal("form")
  const [message, setMessage] = createSignal("")

  // Accordion items
  const accordionItems: AccordionItem[] = [
    {
      title: "🚀 Getting Started",
      content: "This comprehensive example showcases all available Zag.js components integrated with SolidJS and styled with Tailwind CSS."
    },
    {
      title: "🎯 Features",
      content: "All components are fully accessible, keyboard navigable, and follow WAI-ARIA guidelines. They use Zag.js state machines for robust interaction logic."
    },
    {
      title: "🛠️ Technical Details", 
      content: "Built with TypeScript, SolidJS reactive primitives, and framework-agnostic Zag.js state machines. Styled with Tailwind CSS utility classes."
    }
  ]

  // Tab items
  const tabItems: TabItem[] = [
    {
      value: "form",
      label: "📝 Interactive Form",
      content: (
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              placeholder="Enter your name"
              value={formData().name}
              onInput={(e: any) => setFormData(prev => ({ ...prev, name: e.currentTarget.value }))}
              helperText="This will be used for your profile"
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={formData().email}
              onInput={(e: any) => setFormData(prev => ({ ...prev, email: e.currentTarget.value }))}
              invalid={!!formData().email && !formData().email.includes('@')}
              errorText="Please enter a valid email address"
            />
          </div>

          <NumberInput
            label="Age"
            value={formData().age}
            min={0}
            max={120}
            onChange={(value) => setFormData(prev => ({ ...prev, age: value }))}
            helperText="Must be 18 or older to create an account"
          />

          <div class="space-y-4">
            <h4 class="font-medium text-gray-900">Preferences</h4>
            
            <Checkbox
              label="Enable push notifications"
              description="Get notified about important updates"
              checked={formData().notifications}
              onChange={(checked) => setFormData(prev => ({ ...prev, notifications: checked }))}
            />

            <Switch
              label="Subscribe to newsletter"
              description="Receive weekly updates about new features"
              checked={formData().newsletter}
              onChange={(checked) => setFormData(prev => ({ ...prev, newsletter: checked }))}
            />
          </div>

          <RadioGroup
            label="Choose your theme"
            options={[
              { value: "light", label: "☀️ Light Theme", description: "Clean and bright interface" },
              { value: "dark", label: "🌙 Dark Theme", description: "Easy on the eyes" },
              { value: "auto", label: "🔄 Auto Theme", description: "Matches system preference" }
            ]}
            value={formData().theme}
            onChange={(value) => setFormData(prev => ({ ...prev, theme: value }))}
          />
        </div>
      )
    },
    {
      value: "pricing",
      label: "💰 Pricing Plans",
      content: (
        <div class="space-y-6">
          <RadioGroup
            label="Select a plan"
            options={[
              { value: "basic", label: "Basic Plan", description: "$9/month - Perfect for individuals" },
              { value: "pro", label: "Pro Plan", description: "$29/month - Great for small teams" },
              { value: "enterprise", label: "Enterprise", description: "$99/month - For large organizations" }
            ]}
            value={formData().plan}
            onChange={(value) => setFormData(prev => ({ ...prev, plan: value }))}
            orientation="vertical"
          />

          <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 class="font-medium text-blue-900 mb-2">Current Selection</h4>
            <p class="text-blue-800">
              You've selected the <strong>{formData().plan}</strong> plan.
            </p>
          </div>
        </div>
      )
    },
    {
      value: "data",
      label: "📊 Your Data",
      content: (
        <div class="space-y-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <h4 class="font-medium mb-3">Current Form Data:</h4>
            <pre class="text-sm text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(formData(), null, 2)}
            </pre>
          </div>
          
          <div class="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setFormData({
                name: "",
                email: "",
                age: 25,
                notifications: false,
                newsletter: false,
                theme: "light",
                plan: "basic"
              })}
            >
              Reset Data
            </Button>
            
            <Button 
              variant="primary"
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(formData(), null, 2))
                setMessage("Data copied to clipboard!")
                setTimeout(() => setMessage(""), 3000)
              }}
            >
              Copy JSON
            </Button>
          </div>
        </div>
      )
    }
  ]

  const handleSubmit = () => {
    if (!formData().name || !formData().email) {
      setMessage("Please fill in all required fields")
      return
    }
    
    setMessage(`Welcome, ${formData().name}! Form submitted successfully.`)
  }

  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div class="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            🎯 Complete Zag.js Component Library
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive showcase of all Zag.js components integrated with SolidJS. 
            Each component demonstrates accessibility, keyboard navigation, and proper state management.
          </p>
        </div>

        {/* Status Message */}
        {message() && (
          <Card variant="elevated" class="max-w-2xl mx-auto">
            <CardBody>
              <div class="flex items-center gap-3">
                <div class="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <p class="text-green-800 font-medium">{message()}</p>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Button Showcase */}
        <Card variant="elevated">
          <CardHeader>
            <h2>🔘 Button Components & Tooltips</h2>
          </CardHeader>
          <CardBody>
            <div class="space-y-6">
              <div>
                <h4 class="font-medium mb-3">Button Variants</h4>
                <div class="flex flex-wrap gap-4">
                  <Tooltip content="Primary action button">
                    <Button variant="primary">Primary</Button>
                  </Tooltip>
                  
                  <Tooltip content="Secondary action button">
                    <Button variant="secondary">Secondary</Button>
                  </Tooltip>
                  
                  <Tooltip content="Outlined button style">
                    <Button variant="outline">Outline</Button>
                  </Tooltip>
                  
                  <Tooltip content="Ghost button with minimal styling">
                    <Button variant="ghost">Ghost</Button>
                  </Tooltip>
                  
                  <Tooltip content="Dangerous actions" placement="top">
                    <Button variant="destructive">Destructive</Button>
                  </Tooltip>
                </div>
              </div>
              
              <div>
                <h4 class="font-medium mb-3">Button Sizes</h4>
                <div class="flex items-center gap-4">
                  <Tooltip content="Small button size">
                    <Button size="sm">Small</Button>
                  </Tooltip>
                  
                  <Tooltip content="Medium button size (default)">
                    <Button size="md">Medium</Button>
                  </Tooltip>
                  
                  <Tooltip content="Large button size">
                    <Button size="lg">Large</Button>
                  </Tooltip>
                </div>
              </div>

              <div>
                <h4 class="font-medium mb-3">Special States</h4>
                <div class="flex gap-4">
                  <Button loading={true}>Loading...</Button>
                  <Button disabled={true}>Disabled</Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Main Interactive Content */}
        <Card variant="elevated">
          <CardHeader>
            <h2>📋 Interactive Components Showcase</h2>
          </CardHeader>
          <CardBody>
            <Tabs
              items={tabItems}
              value={activeTab()}
              onValueChange={(details) => setActiveTab(details.value)}
              class="w-full"
            />
          </CardBody>
          <CardFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setFormData({
                  name: "",
                  email: "",
                  age: 25,
                  notifications: false,
                  newsletter: false,
                  theme: "light", 
                  plan: "basic"
                })
                setMessage("")
              }}
            >
              Reset All
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmit}
              disabled={!formData().name || !formData().email}
            >
              Submit Form
            </Button>
          </CardFooter>
        </Card>

        {/* Accordion Information */}
        <Card variant="elevated">
          <CardHeader>
            <h2>📚 Documentation & Information</h2>
          </CardHeader>
          <CardBody>
            <Accordion
              items={accordionItems}
              multiple={true}
              collapsible={true}
              class="space-y-2"
            />
          </CardBody>
        </Card>

        {/* Component Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card variant="outlined">
            <CardHeader>
              <h3>✅ Form Controls</h3>
            </CardHeader>
            <CardBody>
              <ul class="space-y-2 text-sm text-gray-600">
                <li>• Input fields with validation</li>
                <li>• Number inputs with step controls</li>
                <li>• Checkboxes and switches</li>
                <li>• Radio button groups</li>
              </ul>
            </CardBody>
          </Card>

          <Card variant="outlined">
            <CardHeader>
              <h3>🎯 Interactive Elements</h3>
            </CardHeader>
            <CardBody>
              <ul class="space-y-2 text-sm text-gray-600">
                <li>• Tooltips with positioning</li>
                <li>• Tabbed navigation</li>
                <li>• Collapsible accordions</li>
                <li>• Button variants & states</li>
              </ul>
            </CardBody>
          </Card>

          <Card variant="outlined">
            <CardHeader>
              <h3>♿ Accessibility</h3>
            </CardHeader>
            <CardBody>
              <ul class="space-y-2 text-sm text-gray-600">
                <li>• Full keyboard navigation</li>
                <li>• Screen reader support</li>
                <li>• ARIA compliance</li>
                <li>• Focus management</li>
              </ul>
            </CardBody>
          </Card>
        </div>

        {/* Footer */}
        <Card variant="ghost" class="text-center">
          <CardBody>
            <p class="text-gray-600">
              🚀 Built with{" "}
              <Tooltip content="Framework-agnostic UI state machines">
                <span class="font-semibold text-blue-600 cursor-help">Zag.js</span>
              </Tooltip>
              {" "}+{" "}
              <Tooltip content="Fine-grained reactive JavaScript library">
                <span class="font-semibold text-blue-600 cursor-help">SolidJS</span>
              </Tooltip>
              {" "}+{" "}
              <Tooltip content="Utility-first CSS framework">
                <span class="font-semibold text-blue-600 cursor-help">Tailwind CSS</span>
              </Tooltip>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}