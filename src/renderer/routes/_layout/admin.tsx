import { Box, Container, Text } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"
import React from "react"

export const Route = createFileRoute("/_layout/admin")({
  component: Admin,
})

function Admin() {
  return (
    <>
      <Container maxW="full">
        <Box pt={12} m={4}>
          <Text fontSize="2xl">Hi, Admin Page!!!! </Text>
        </Box>
      </Container>
    </>
  )
}
