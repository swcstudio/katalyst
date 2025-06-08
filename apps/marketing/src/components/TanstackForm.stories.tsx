import type { Meta, StoryObj } from '@storybook/solid';
import TanstackForm from './TanstackForm';

const meta: Meta<typeof TanstackForm> = {
  title: 'Marketing/TanstackForm',
  component: TanstackForm,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValidation: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Form with validation enabled',
      },
    },
  },
};
