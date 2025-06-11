import { For, createMemo, createSignal } from 'solid-js';
import {
  Accordion,
  type AccordionItem,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Dialog,
  Input,
  Select,
  type SelectOption,
  Switch,
  Toast,
  createToastService,
} from './index';

export function ArkUIExample() {
  const [inputValue, setInputValue] = createSignal('');
  const [checkboxChecked, setCheckboxChecked] = createSignal(false);
  const [switchChecked, setSwitchChecked] = createSignal(false);
  const [selectedValue, setSelectedValue] = createSignal('');
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [loading, setLoading] = createSignal(false);

  const toastService = createToastService();

  const accordionItems: AccordionItem[] = [
    {
      title: 'Getting Started',
      content: 'Learn how to set up and use our Ark UI components in your SolidJS project.',
    },
    {
      title: 'Components',
      content: 'Explore our collection of accessible and customizable UI components.',
    },
    {
      title: 'Styling',
      content: 'Customize the appearance of components using Tailwind CSS classes.',
    },
  ];

  const selectOptions: SelectOption[] = [
    { label: 'React', value: 'react' },
    { label: 'Vue', value: 'vue' },
    { label: 'Angular', value: 'angular' },
    { label: 'Svelte', value: 'svelte' },
    { label: 'SolidJS', value: 'solid' },
  ];

  const handleSubmit = async () => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toastService.success({
        title: 'Success!',
        description: 'Form submitted successfully.',
        duration: 3000,
      });
    }, 2000);
  };

  const formData = createMemo(() => ({
    input: inputValue(),
    checkbox: checkboxChecked(),
    switch: switchChecked(),
    select: selectedValue(),
  }));

  return (
    <div class="min-h-screen bg-gray-50 p-8">
      <div class="max-w-6xl mx-auto space-y-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Ark UI Components</h1>
          <p class="text-xl text-gray-600">Built with Zag-js state machines for SolidJS</p>
        </div>

        {/* Cards Section */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card variant="elevated" size="sm">
            <CardHeader>
              <h3>Elevated Card</h3>
            </CardHeader>
            <CardBody>
              <p>This card has an elevated shadow effect.</p>
            </CardBody>
          </Card>

          <Card variant="outlined" size="sm">
            <CardHeader>
              <h3>Outlined Card</h3>
            </CardHeader>
            <CardBody>
              <p>This card has a border outline.</p>
            </CardBody>
          </Card>

          <Card variant="filled" size="sm">
            <CardHeader>
              <h3>Filled Card</h3>
            </CardHeader>
            <CardBody>
              <p>This card has a filled background.</p>
            </CardBody>
          </Card>
        </div>

        {/* Form Section */}
        <Card variant="elevated" class="max-w-2xl mx-auto">
          <CardHeader>
            <h2>Interactive Form Example</h2>
          </CardHeader>
          <CardBody>
            <div class="space-y-6">
              <Input
                label="Your Name"
                placeholder="Enter your name"
                value={inputValue()}
                onInput={(e) => setInputValue(e.currentTarget.value)}
                helperText="This field is required"
              />

              <Select
                label="Favorite Framework"
                options={selectOptions}
                placeholder="Choose a framework"
                value={selectedValue()}
                onChange={setSelectedValue}
              />

              <div class="flex items-center gap-6">
                <Checkbox
                  label="I agree to the terms"
                  checked={checkboxChecked()}
                  onChange={setCheckboxChecked}
                />

                <Switch
                  label="Enable notifications"
                  checked={switchChecked()}
                  onChange={setSwitchChecked}
                />
              </div>

              <div class="bg-gray-100 p-4 rounded-lg">
                <h4 class="font-medium mb-2">Form Data:</h4>
                <pre class="text-sm text-gray-700">{JSON.stringify(formData(), null, 2)}</pre>
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <Button
              variant="secondary"
              onClick={() => {
                setInputValue('');
                setSelectedValue('');
                setCheckboxChecked(false);
                setSwitchChecked(false);
              }}
            >
              Reset
            </Button>
            <Button
              variant="primary"
              loading={loading()}
              onClick={handleSubmit}
              disabled={!inputValue() || !checkboxChecked()}
            >
              Submit
            </Button>
          </CardFooter>
        </Card>

        {/* Button Variants */}
        <Card variant="elevated" class="max-w-4xl mx-auto">
          <CardHeader>
            <h2>Button Variants</h2>
          </CardHeader>
          <CardBody>
            <div class="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>

            <div class="mt-6">
              <h4 class="font-medium mb-3">Button Sizes</h4>
              <div class="flex items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Accordion */}
        <Card variant="elevated" class="max-w-4xl mx-auto">
          <CardHeader>
            <h2>Accordion Component</h2>
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

        {/* Dialog Example */}
        <Card variant="elevated" class="max-w-4xl mx-auto">
          <CardHeader>
            <h2>Dialog Component</h2>
          </CardHeader>
          <CardBody>
            <div class="flex gap-4">
              <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>

              <Button
                onClick={() =>
                  toastService.info({
                    title: 'Info Toast',
                    description: 'This is an informational message.',
                  })
                }
              >
                Show Toast
              </Button>

              <Button
                onClick={() =>
                  toastService.error({
                    title: 'Error Toast',
                    description: 'Something went wrong!',
                    action: {
                      label: 'Retry',
                      onClick: () => console.log('Retry clicked'),
                    },
                  })
                }
              >
                Show Error Toast
              </Button>
            </div>

            <Dialog
              open={dialogOpen()}
              onOpenChange={setDialogOpen}
              title="Example Dialog"
              description="This is a sample dialog built with Ark UI."
            >
              <div class="space-y-4">
                <p>You can put any content inside this dialog.</p>
                <div class="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setDialogOpen(false)}>Confirm</Button>
                </div>
              </div>
            </Dialog>
          </CardBody>
        </Card>

        {/* Toast Container */}
        <Toast />
      </div>
    </div>
  );
}
