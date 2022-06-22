const { User } = require("../models/User");
const mongoose = require("mongoose");

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
  classId,
  { search, query, offset, limit, fields, sort }
) {
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
        ? { [`user.${field}`]: `${parseInt(search, 10)}` }
        : { [`user.${field}`]: new RegExp(search, "gi") };
    });

  if (classId) {
    query["user.class"] = classId;
  }

  if (query.classInfo) {
    query["user.class"] = new mongoose.Types.ObjectId(query.classInfo);
    delete query.classInfo;
  }
  
  const aggOptions = [
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "classes",
        localField: "user.class",
        foreignField: "_id",
        as: "classInfo",
      },
    },
    {
      $unwind: {
        path: "$classInfo",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: search ? { $or: s, ...query } : query,
    },
    {
      $project: {
        "user.name": 1,
        "user.email": 1,
        "user.phoneNumber": 1,
        "user.isActive": 1,
        "classInfo._id": 1,
        "classInfo.name": 1,
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

  const documents = await model.aggregate(aggOptions);
  const count = await model.countDocuments(aggOptions);
  return { documents, count };
}

module.exports = {
  findAll,
  findAllWithPopulatedFields,
  findAllWithUserPopulatedFields,
};
