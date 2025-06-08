import type { Meta, StoryObj } from '@storybook/solid';
import TanstackPacer from './TanstackPacer';

const meta: Meta<typeof TanstackPacer> = {
  title: 'Marketing/TanstackPacer',
  component: TanstackPacer,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomTiming: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Pacer with custom timing configuration',
      },
    },
  },
};
