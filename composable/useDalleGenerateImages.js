import { dummyGenerations } from '../dummyData/testGenerations.js'
import { simulateFetch } from '../utils/simulateFetch.js'

const useDalleGenerateImages = async (dalle, prompt, isTest = false) => {
   try {
      let generations;

      if (isTest) {
        const simulationTimeInSeconds = (Math.random() * 3 + 1) * 1000
        await simulateFetch(simulationTimeInSeconds)
        generations = dummyGenerations() 
      } else generations = await dalle.generate(prompt);

      return {
        generations: generations.data,
        fetchError: null
      }
    } catch(err) {
      console.log('== [useDalleGenerateImages] ==', err)
      return {
        generations: null,
        fetchError: err
      }
    }
}

export default useDalleGenerateImages;