import { View, Text } from 'react-native';
import { Box, Heading } from '@gluestack-ui/themed';

export default function Dashboard() {
  return (
    <Box flex={1} justifyContent="center" alignItems="center" p="$4">
      <Heading size="md">Dashboard Screen</Heading>
      <Text>Integrated with custom hooks and design-system.</Text>
    </Box>
  );
}
