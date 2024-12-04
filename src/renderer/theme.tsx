import { createSystem, defineConfig, defineTokens } from "@chakra-ui/react"

const config = defineConfig({
  theme: {
    tokens: {},
  },
})

export default createSystem(config)
