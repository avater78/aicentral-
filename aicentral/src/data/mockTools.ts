import { AITool } from '../types';
import { TOOLS_PART_1 } from './toolsData1';
import { TOOLS_PART_2 } from './toolsData2';
import { generateFullToolsCatalog } from './toolsDataGenerated';

const HANDCRAFTED_TOOLS = [...TOOLS_PART_1, ...TOOLS_PART_2];
const GENERATED_TOOLS = generateFullToolsCatalog(HANDCRAFTED_TOOLS.length, 1500);

export const MOCK_TOOLS: AITool[] = [
  ...HANDCRAFTED_TOOLS,
  ...GENERATED_TOOLS
];

