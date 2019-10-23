
// Handle basic CRUD for a record and form
export default ({createMutation, readLazyQuery, updateMutation, typeName}) => {
  // Create a record or Modify an existing record
  const [loadRecord, {loading: recordLoading, error: queryError, data: queryResult }] = readLazyQuery;
  const [updateRecord, {loading: updateLoading, error: updateError, data: updatedResult }] = updateMutation;
  const [createRecord, {loading: createLoading, error: createError, data: createdResult }] = createMutation;
  const isLoading = recordLoading || updateLoading || createLoading
  const returnedData = updatedResult || createdResult || queryResult
  let result = {}
  if (returnedData && returnedData.result) {
    result = returnedData.result[typeName]
  } else if (returnedData && returnedData[typeName]) {
    result = returnedData[typeName]
  }
  const error = updateError || createError || queryError
  const isNewRecord = !result.id

  function createOrUpdate(data) {
    let record = result
    if (record.id) {
      data.id = result.id // Ensure ID is set
      return updateRecord({variables: data})
    } else {
      return createRecord({variables: data})
    }
  }


  return {
    isLoading,
    isNewRecord,
    result,
    error,
    createOrUpdate,
    loadRecord
  }

}
