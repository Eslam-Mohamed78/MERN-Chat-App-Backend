// *************** Filter ************ //
export const search = function (modelKeys, queryParams, userId) {
  const queryKeys = Object.keys(queryParams);

  const matchedKeys = queryKeys.filter((key) => modelKeys.includes(key));
  if (!matchedKeys.length) return;

  const options =
    matchedKeys.map((key) => {
      const option = {};
      option[key] = { $regex: queryParams[key], $options: "i" };
      return option;
    }) || "";

  return { $or: options, _id: { $ne: userId } };
};
