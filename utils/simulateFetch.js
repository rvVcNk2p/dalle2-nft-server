export const simulateFetch = async (delay = 1000, callback = () => {}) => {        

  const delayPromise = ms => new Promise(res => setTimeout(res, ms))
  await delayPromise(delay)

  callback()
}