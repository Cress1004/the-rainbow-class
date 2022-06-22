
const getContextAudioSectionByCampaignId = async ({
    campaignId,
    offset,
    limit,
  }) => {
    const aggOptions = [
      {
        $lookup: {
          from: 'contextaudios',
          localField: 'contextAudioId',
          foreignField: '_id',
          as: 'contextAudio',
        },
      },
      {
        $unwind: {
          path: '$contextAudio',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          'contextAudio.campaignId': campaignId,
        },
      },
    ];
    const allSectionList = await contextAudioSection.aggregate(aggOptions);
    const count = allSectionList.length;
    if (offset)
      aggOptions.push({
        $skip: offset,
      });
    if (limit)
      aggOptions.push({
        $limit: limit,
      });
    const sectionList = await contextAudioSection.aggregate(aggOptions);
    return {
      sectionList,
      count,
      totalDuration: allSectionList.reduce(
        (curDur, obj) => curDur + Number(obj.duration),
        0,
      ),
      validatedAudioNo: allSectionList.filter(
        (audio) => audio.status === VALIDATE_STATUS.VALIDATED,
      ).length,
    };
  };
  