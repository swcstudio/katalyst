import type { Meta, StoryObj } from '@storybook/solid';
import TanstackTable from './TanstackTable';

const meta: Meta<typeof TanstackTable> = {
  title: 'Marketing/TanstackTable',
  component: TanstackTable,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSorting: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Table with sorting capabilities',
      },
    },
  },
};
