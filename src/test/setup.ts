class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// @ts-expect-error jsdom does not implement these observers
globalThis.IntersectionObserver = IntersectionObserverMock
// @ts-expect-error jsdom does not implement these observers
globalThis.ResizeObserver = ResizeObserverMock
