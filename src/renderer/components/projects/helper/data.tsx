
// 获取最高优先级状态
export const STATUS_PRIORITY: any = {
  0: 0, // 未上传
  1: 3, // 不勾稽
  2: 4, // 需重汇
  3: 5, // 需下载
  4: 1, // 需上传
  5: 2, // 已提交(发布)
};

export const Status: any = {
  // 服务器状态枚举
  CLOUD: {
    UNDRAFT: 0, // 未上传
    DRAFT: 1, // 已上传
    PUBLISH: 2, // 已提交（发布）
  },
  // 本地状态枚举
  LOCAL: {
    UNDRAFT: 0, // 未上传
    DRAFT: 1, // 已上传
    PUBLISH: 2, // 已提交（发布）
    MERGED_UNRECONCILED: 3, // 不勾稽
    NEED_UPDATE: 4, // 需下载
    NEED_REAGGREGATE: 5, // 需重汇
  },
  // 状态转换映射表：线上---本地
  MAPPING: {
    0: 0,
    1: 1,
    2: 2,
  },
};
// 状态枚举配置
export const STATUS_CONFIG: any = {
  [0]: {
    status: 0,
    label: '未上传',
    color: 'bg-gray-100 text-gray-500',
  },
  1: {
    status: 1,
    label: '已上传',
    color: 'text-blue-800',
  },
  2: {
    status: 2,
    label: '已提交',
    color: 'text-[var(--ant-success-color)]',
  },
  3: {
    status: 3,
    label: '不勾稽',
    color: 'bg-yellow-100 text-yellow-800',
  },
  4: {
    status: 4,
    label: '需下载',
    color: 'text-red-500',
  },
  5: {
    status: 5,
    label: '需重汇',
    color: 'text-red-500',
    icon: <span className="text-[12px] !text-red-500">汇</span>,
  },
};

/**
 * 本地与线上只比较，需重汇本地展示）
 * 比较本地和服务器的版本号
 * @param localDataList
 * @param cloudDataArr
 * @returns
 */
export function compareLocalToRemoteVersion(localDataList: any[], cloudDataArr: any[]) {
  // 创建快速查找字典
  const localMap = new Map(localDataList.map((item) => [item.zcbfid, item]));
  const cloudMap = new Map(cloudDataArr.map((item) => [item.zcbfid, item]));

  const result = {
    needReaggregate: new Set(),
    useCloudStatus: new Set(),
    keepLocalStatus: new Set(),
    statusMap: new Map(), // 状态映射表
  };

  // 处理云数据节点
  for (const cloudNode of cloudDataArr) {
    const { zcbfid, mergedStatus: cloudStatus, dataGenTime } = cloudNode;
    const localNode = localMap.get(zcbfid);
    const mappedStatus = Status.MAPPING[cloudStatus || 0]; // 暂时不存在为1
    let currentStatus: number[] = [];

    // 情况1：本地不存在该节点, 需下载
    if (!localNode) {
      result.useCloudStatus.add(zcbfid);
      currentStatus.push(Status.LOCAL.NEED_UPDATE);
      result.statusMap.set(zcbfid, currentStatus);
      continue;
    }
    // 本地版本较旧
    if (localNode.dataGenTime < cloudNode.dataGenTime) {
      // 本地版本较旧
      result.useCloudStatus.add(zcbfid);
      currentStatus = [...localNode.mergedStatus, Status.LOCAL.NEED_UPDATE, mappedStatus];
    }
    // 更新状态映射表
    result.statusMap.set(zcbfid, currentStatus);
  }

  // 处理本地特关联节点
  for (const localNode of localDataList) {
    const { mergedStatus: status } = localNode;
    if (!cloudMap.has(localNode.zcbfid)) {
      result.keepLocalStatus.add(localNode.zcbfid);
      result.statusMap.set(localNode.zcbfid, status);
    } else {
      // 本地和线上都存在该节点
      // 处理本地节点之间的变动,
      // 比较mergedZcbfidsDetail中的是否发生变动
      const cloudNode = cloudMap.get(localNode.zcbfid);
      if (localNode.dataGenTime >= cloudNode.dataGenTime) {
        if (Array.isArray(localNode.mergedZcbfidsDetail) && localNode.mergedZcbfidsDetail.length > 0) {
          // 是虚拟合并节点，判断是否要需重汇
          let needCheck = false;
          // 检查合并关联节点
          for (const mergeItem of localNode.mergedZcbfidsDetail) {
            const mergeId = mergeItem.zcbfid;
            const localMerge = localMap.get(mergeItem.zcbfid);
            // 下级节点又被删除。需重汇
            if (!localMerge) {
              needCheck = true;
              break;
            }
            // 存在时间不一致的，需重汇
            if (localMerge && mergeItem && localMerge.dataGenTime != mergeItem.dataGenTime) {
              needCheck = true;
              break;
            }
          }
          // 获取该节点已有的状态
          let currentStatus = result.statusMap.get(localNode.zcbfid) || [];

          if (needCheck) {
            // 需重汇
            result.needReaggregate.add(localNode.zcbfid);
            currentStatus.push(Status.LOCAL.NEED_REAGGREGATE);
          } else {
            result.keepLocalStatus.add(localNode.zcbfid);
            currentStatus = currentStatus.concat(status);
          }

          result.statusMap.set(localNode.zcbfid, currentStatus); // 需重汇
        } else {
          result.keepLocalStatus.add(localNode.zcbfid);
          result.statusMap.set(localNode.zcbfid, status);
        }
      }
    }
  }

  const convertedMap = new Map(convertSetStatus(result.statusMap) as any);
  return {
    needReaggregate: Array.from(result.needReaggregate),
    useCloudStatus: Array.from(result.useCloudStatus),
    keepLocalStatus: Array.from(result.keepLocalStatus),
    statusMap: convertedMap,
  };
}

// 转换函数
export function convertSetStatus(mapData: any) {
  return Array.from(mapData).map(([key, statusSet]: any) => {
    // 处理空Set的情况
    if (statusSet.size === 0) {
      return [key, [{ status: -1 }]];
    }

    // 转换Set到配置数组
    const statusArray = Array.from(statusSet).map((code: any) => ({
      status: Number(code),
    }));

    return [key, statusArray];
  });
}

export function getPrimaryStatus(statusArray: any) {
  if (!Array.isArray(statusArray) || statusArray.length === 0) return [];
  return statusArray.reduce((prev, current) =>
    STATUS_PRIORITY[current.status] < STATUS_PRIORITY[prev.status] ? current : prev,
  );
}
// 状态排序
export function sortByStatus(statusArray: any) {
  if (!Array.isArray(statusArray)) {
    return [];
  }

  // 创建副本避免修改原数组
  return [...statusArray].sort((a, b) => {
    // 获取优先级，处理非法状态
    const priorityA = STATUS_PRIORITY[a.status] || Number.MAX_SAFE_INTEGER;
    const priorityB = STATUS_PRIORITY[b.status] || Number.MAX_SAFE_INTEGER;

    // 升序排列（数值小的优先级高）
    return priorityA - priorityB;
  });
}
