import { Box, Container } from '@chakra-ui/react';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box minH="100vh" bg="gray.50">
      <AdminHeader />
      <Container maxW="container.xl" py={8}>
        {children}
      </Container>
    </Box>
  );
} 