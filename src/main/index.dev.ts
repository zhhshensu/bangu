// Warning: This file is only used in the development environment
// and is removed at build time.
// Do not edit the file unless necessary.
import {
  REACT_DEVELOPER_TOOLS,
  installExtension,
} from "electron-extension-installer"

installExtension(REACT_DEVELOPER_TOOLS, {
  loadExtensionOptions: {
    allowFileAccess: true,
  },
})
