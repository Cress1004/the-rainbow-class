export function transformAddressData(data) {
  return data && data.address && data.description 
    ? `${data.description}, ${data.address.ward.name}, ${data.address.district.name}, ${data.address.province.name}`
    : "";
}

export function transformStudentTypes(data) {
  return data ? data.map((item) => item.title).join(", ") : "";
}

export function getArrayLength(data) {
  return data ? data.length : 0;
}

export function transformStudentTypesToArray(data) {
  return data ? data.map((item) => item.title) : [];
}
