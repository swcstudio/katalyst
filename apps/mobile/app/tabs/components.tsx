import { View, Text } from 'react-native';
import { Box, Heading } from '@gluestack-ui/themed';
import { useTheme } from '@katalyst/hooks';

export default function Components() {
  const theme = useTheme();
  return (
    <Box flex={1} justifyContent="center" alignItems="center" p="$4" bg={theme.bg}>
      <Heading size="md">Components Screen</Heading>
      <Text>Using Gluestack + custom hooks.</Text>
    </Box>
  );
}
