/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAKE_VIP_WEBHOOK: string
  readonly VITE_MAKE_BOOKING_WEBHOOK: string
  readonly VITE_MAKE_CONTACT_WEBHOOK: string
  readonly VITE_MAKE_MESSAGE_WEBHOOK: string
  readonly VITE_DASHBOARD_PASSWORD: string
  readonly VITE_BUSINESS_PHONE: string
  readonly VITE_BUSINESS_EMAIL: string
  readonly VITE_BUSINESS_ADDRESS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
