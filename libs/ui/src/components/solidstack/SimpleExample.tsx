import { createSignal } from 'solid-js';
import {
  Accordion,
  type AccordionItem,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
} from './index.ts';

export function SimpleExample() {
  const [inputValue, setInputValue] = createSignal('');
  const [message, setMessage] = createSignal('');

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

  const handleSubmit = () => {
    if (inputValue()) {
      setMessage(`Hello, ${inputValue()}! Form submitted successfully.`);
    } else {
      setMessage('Please enter your name.');
    }
  };

  const handleReset = () => {
    setInputValue('');
    setMessage('');
  };

  return (
    <div class="min-h-screen bg-gray-50 p-8">
      <div class="max-w-4xl mx-auto space-y-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Ark UI Components</h1>
          <p class="text-xl text-gray-600">Simple working example with SolidJS</p>
        </div>

        {/* Card with Form */}
        <Card variant="elevated" class="max-w-2xl mx-auto">
          <CardHeader>
            <h2>Interactive Form Example</h2>
          </CardHeader>
          <CardBody>
            <div class="space-y-4">
              <Input
                label="Your Name"
                placeholder="Enter your name"
                value={inputValue()}
                onInput={(e: InputEvent & { currentTarget: HTMLInputElement }) => setInputValue(e.currentTarget.value)}
                helperText="This field is required"
              />

              {message() && (
                <div class="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <p class="text-blue-800">{message()}</p>
                </div>
              )}
            </div>
          </CardBody>
          <CardFooter>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
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
      </div>
    </div>
  );
}
