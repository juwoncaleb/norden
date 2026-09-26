import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (product) => {
        const items = get().items
        const existing = items.find((i) => i._id === product._id)
        if (existing) {
          set({
            items: items.map((i) =>
              i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          })
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] })
        }
      },

      removeItem: (id) =>
        set({ items: get().items.filter((i) => i._id !== id) }),

      increaseQty: (id) =>
        set({
          items: get().items.map((i) =>
            i._id === id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }),

      decreaseQty: (id) => {
        const items = get().items
        const item = items.find((i) => i._id === id)
        if (item.quantity === 1) {
          set({ items: items.filter((i) => i._id !== id) })
        } else {
          set({
            items: items.map((i) =>
              i._id === id ? { ...i, quantity: i.quantity - 1 } : i
            ),
          })
        }
      },

      total: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
)