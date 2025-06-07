import type { Meta, StoryObj } from '@storybook/solid';
import TanstackStore from './TanstackStore';

const meta: Meta<typeof TanstackStore> = {
  title: 'Marketing/TanstackStore',
  component: TanstackStore,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
