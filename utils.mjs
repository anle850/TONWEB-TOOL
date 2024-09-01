export const delay = (mts) => new Promise((resolve) => {
  setTimeout(() => {
    resolve()
  }, mts)
})
