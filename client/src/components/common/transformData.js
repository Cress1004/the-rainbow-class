function transformAddressData (data) {
  return data
    ? `${data.description}, ${data.address.ward.name}, ${data.address.district.name}, ${data.address.province.name}`
    : "";
};

function transformStudentTypes (data) {
  return data ? data.map((item) => item.title).join(", ") : "";
};

function getArrayLength (data) {
    return data ? data.length : 0;
}

function transformStudentTypesToArray (data) {
  return data ? data.map(item => item.title) : [];
}

export { transformStudentTypes, transformAddressData, getArrayLength, transformStudentTypesToArray };
