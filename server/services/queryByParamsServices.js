const { User } = require("../models/User");

async function findAll(
  model,
  searchFields,
  { search, query, offset, limit, fields, sort }
) {
  const s = searchFields
    .filter(
      (field) =>
        !(
          model.schema.paths[field].instance === "Number" &&
          isNaN(parseInt(search, 10))
        )
    )
    .map((field) => {
      return model.schema.paths[field].instance === "Number"
        ? { [field]: parseInt(search, 10) }
        : { [field]: new RegExp(search, "gi") };
    });

  const count = await model.countDocuments(
    search ? { $or: s, ...query } : query
  );

  const documents = await model
    .find(search ? { $or: s, ...query } : query)
    .skip(offset || 0)
    .limit(limit || null)
    .sort(
      sort
        ? JSON.parse(
            `{${sort
              .map((element) => {
                const field = element.substring(0, element.lastIndexOf("_"));
                const value =
                  element.substring(element.lastIndexOf("_") + 1) === "asc"
                    ? 1
                    : -1;
                return `"${field}":${value}`;
              })
              .join(",")}}`
          )
        : { _id: 1 }
    )
    .select(
      fields
        ? JSON.parse(`{${fields.map((element) => `"${element}":1`).join(",")}}`)
        : {}
    )
    .lean();

  return { documents, count };
}

async function findAllWithPopulatedFields(
  model,
  searchFields,
  populateFields,
  { search, query, offset, limit, fields, sort },
  counter
) {
  const s = searchFields
    .filter(
      (field) =>
        !(
          model.schema.paths[field].instance === "Number" &&
          isNaN(parseInt(search, 10))
        )
    )
    .map((field) => {
      return model.schema.paths[field].instance === "Number"
        ? { [field]: parseInt(search, 10) }
        : { [field]: new RegExp(search, "gi") };
    });

  const count = await model.countDocuments(
    search ? { $or: s, ...query } : query
  );
  if (!counter) {
    const documents = await model
      .find(search ? { $or: s, ...query } : query)
      .populate(populateFields)
      .skip(offset || 0)
      .limit(limit || null)
      .sort(
        sort
          ? JSON.parse(
              `{${sort
                .map((element) => {
                  const field = element.substring(0, element.lastIndexOf("_"));
                  const value =
                    element.substring(element.lastIndexOf("_") + 1) === "asc"
                      ? 1
                      : -1;
                  return `"${field}":${value}`;
                })
                .join(",")}}`
            )
          : { _id: 1 }
      )
      .select(
        fields
          ? JSON.parse(
              `{${fields.map((element) => `"${element}":1`).join(",")}}`
            )
          : {}
      )
      .lean();

    return { documents, count };
  }
  return { count };
}

async function findAllWithUserPopulatedFields(
  model,
  searchFields,
  { search, query, offset, limit, fields, sort }
) {
  // counter
  const s = searchFields
    .filter(
      (field) =>
        !(
          User.schema.paths[field].instance === "Number" &&
          isNaN(parseInt(search, 10))
        )
    )
    .map((field) => {
      return User.schema.paths[field].instance === "Number"
        ? { [`userInfo.${field}`]: `${parseInt(search, 10)}` }
        : { [`userInfo.${field}`]: new RegExp(search, "gi") };
    });

  const aggOptions = [
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    {
      $unwind: {
        path: "$userInfo",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: search ? { $or: s, ...query } : query,
    },
    {
      $project: {
        "userInfo.name": 1,
        "userInfo.email": 1,
        "userInfo.phoneNumber": 1,
      },
    },
    {
      $sort: sort
        ? JSON.parse(
            `{${sort
              .map((element) => {
                const field = element.substring(0, element.lastIndexOf("_"));
                const value =
                  element.substring(element.lastIndexOf("_") + 1) === "asc"
                    ? 1
                    : -1;
                return `"${field}":${value}`;
              })
              .join(",")}}`
          )
        : { _id: 1 },
    },
  ];
  if (offset)
    aggOptions.push({
      $skip: offset,
    });
  if (limit)
    aggOptions.push({
      $limit: limit,
    });
  // aggOptions.sort({
  //   $sort: sort
  //     ? JSON.parse(
  //         `{${sort
  //           .map((element) => {
  //             const field = element.substring(0, element.lastIndexOf("_"));
  //             const value =
  //               element.substring(element.lastIndexOf("_") + 1) === "asc"
  //                 ? 1
  //                 : -1;
  //             return `"${field}":${value}`;
  //           })
  //           .join(",")}}`
  //       )
  //     : { _id: 1 },
  // });
  const documents = await model.aggregate(aggOptions);
  const count = await model.countDocuments(aggOptions);
  // if (!counter) {
  //   const documents = await model
  //     .find(search ? { $or: s, ...query } : query)
  //     .populate(populateFields)
  //     .skip(offset || 0)
  //     .limit(limit || null)
  //     .sort(
  //       sort
  //         ? JSON.parse(
  //             `{${sort
  //               .map((element) => {
  //                 const field = element.substring(0, element.lastIndexOf("_"));
  //                 const value =
  //                   element.substring(element.lastIndexOf("_") + 1) === "asc"
  //                     ? 1
  //                     : -1;
  //                 return `"${field}":${value}`;
  //               })
  //               .join(",")}}`
  //           )
  //         : { _id: 1 }
  //     )
  //     .select(
  //       fields
  //         ? JSON.parse(
  //             `{${fields.map((element) => `"${element}":1`).join(",")}}`
  //           )
  //         : {}
  //     )
  //     .lean();

  return { documents, count };
}

module.exports = {
  findAll,
  findAllWithPopulatedFields,
  findAllWithUserPopulatedFields,
};
