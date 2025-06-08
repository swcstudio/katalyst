import type { Meta, StoryObj } from '@storybook/solid';
import TanstackVirtual from './TanstackVirtual';

const meta: Meta<typeof TanstackVirtual> = {
  title: 'Marketing/TanstackVirtual',
  component: TanstackVirtual,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LargeDataset: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Virtual scrolling with large dataset',
      },
    },
  },
};
