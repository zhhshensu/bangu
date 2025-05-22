export interface TreeNode {
  guid: string; // 节点唯一标识
  parent_id: string | null; // 父节点标识，null 表示根节点
  [key: string]: any;
}

/**
 * 根据指定 guid 获取当前节点及其所有下级节点
 * @param targetId 目标节点 id
 * @param nodes 平铺的节点数组
 * @param skipSelf 是否跳过自己
 * @returns 包含目标节点及其所有子节点的数组
 */
export function getFlattenedTree(
  targetId: number,
  nodes: TreeNode[],
  skipSelf?: boolean
): TreeNode[] {
  // 1. 建立 pid 到子节点的映射，优化查询速度
  const pidToChildrenMap = new Map<string | null, TreeNode[]>();
  nodes.forEach((node) => {
    const pid = node.parent_id;
    if (!pidToChildrenMap.has(pid)) {
      pidToChildrenMap.set(pid, []);
    }
    pidToChildrenMap.get(pid)!.push(node);
  });

  // 2. 查找目标节点是否存在
  const targetNode = nodes.find((node: any) => node.guid === targetId);
  if (!targetNode) return [];

  // 3. 使用队列进行 BFS 遍历，收集所有子节点
  const result: TreeNode[] = skipSelf ? [] : [targetNode];
  const queue: number[] = [targetId];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const children = pidToChildrenMap.get(currentId) || [];

    children.forEach((child) => {
      result.push(child);
      queue.push(child.guid);
    });
  }

  return result;
}
/**
 *
 * @param nodes
 * @returns
 */
export function convertToTree(nodes: TreeNode[]): TreeNode[] {
  // 创建哈希映射和结果集
  const nodeMap = new Map<string, TreeNode>();
  const tree: TreeNode[] = [];

  nodes.forEach((node) => {
    const newNode = {
      ...node,
      key: node.guid, // Ant Design Tree 必要字段
      title: node.short_name, // Ant Design Tree 显示内容
      id: node.guid, // PrimeReact 必要字段
      data: node.short_name, // PrimeReact 数据字段
      label: node.short_name, // PrimeReact 显示内容
      leaf: true, // 默认是叶子节点
    };
    nodeMap.set(node.guid, newNode);
  });

  nodes.forEach((node) => {
    const currentNode = nodeMap.get(node.guid)!;
    if (node.parent_id !== null) {
      const parent = nodeMap.get(node.parent_id);
      if (parent) {
        // 动态创建 children 属性
        if (!parent.children) {
          parent.children = []; // 创建时初始化空数组
          parent.leaf = false; // 标记为非叶子节点
        }
        parent.children.push(currentNode);
      }
    } else {
      tree.push(currentNode);
    }
  });

  return tree;
}
