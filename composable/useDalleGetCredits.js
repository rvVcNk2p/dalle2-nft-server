const useDalleGetCredits = async (dalle) => {
   try {
      const creditsSummary = await dalle.getCredits();
      const totalCreditsLeft = creditsSummary.aggregate_credits;
      return {
        totalCreditsLeft,
        fetchError: null
      }
    } catch(err) {
      console.log('== [useDalleGetCredits] ==', err)
      return {
        totalCreditsLeft: null,
        fetchError: err
      }
    }
}

export default useDalleGetCredits;